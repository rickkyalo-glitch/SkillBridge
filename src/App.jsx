import { useRef, useState } from "react";
import { USERS, INITIAL_REQUESTS, INITIAL_SESSIONS } from "./data.js";
import { calcMatch, getAvatarColor } from "./utils.js";

import Nav from "./components/Nav.jsx";
import Toast from "./components/Toast.jsx";
import RequestModal from "./components/modals/RequestModal.jsx";
import SessionModal from "./components/modals/SessionModal.jsx";
import ReviewModal from "./components/modals/ReviewModal.jsx";

import DiscoverPage from "./pages/DiscoverPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";

export default function App() {
  /* ---------- global / cross-page state ---------- */
  const [page, setPage] = useState("discover");
  const [myOffers, setMyOffers] = useState(["Python", "Flask", "Git"]);
  const [myWants, setMyWants] = useState(["UI Design", "Spanish", "Piano"]);
  const [myCoins, setMyCoins] = useState(12);
  const [sentSet, setSentSet] = useState(new Set([3]));
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const nextId = useRef(100);

  const [toast, setToast] = useState({ show: false, msg: "", type: "" });
  const toastTimer = useRef(null);

  function showToast(msg, type = "") {
    clearTimeout(toastTimer.current);
    setToast({ show: true, msg, type });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }

  function updateCoins(delta) {
    setMyCoins((c) => c + delta);
  }

  function nav(p) { setPage(p); }

  /* ---------- discover: search / filter / request modal ---------- */
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [reqModalUser, setReqModalUser] = useState(null);
  const [exchangeType, setExchangeTypeState] = useState("swap");
  const [reqOfferSel, setReqOfferSel] = useState("");
  const [reqWantSel, setReqWantSel] = useState("");
  const [reqCoinWantSel, setReqCoinWantSel] = useState("");
  const [reqMsg, setReqMsg] = useState("");

  function setTag(tag) { setActiveTag((t) => (t === tag ? "" : tag)); }

  function openReqModal(user) {
    if (!user || sentSet.has(user.id)) return;
    setReqModalUser(user);
    setExchangeTypeState("swap");
    setReqOfferSel(myOffers[0] || "");
    setReqWantSel(user.offers[0] || "");
    setReqCoinWantSel(user.offers[0] || "");
    setReqMsg("");
    setReqModalOpen(true);
  }
  function closeReqModal() { setReqModalOpen(false); setReqModalUser(null); }

  function sendRequest() {
    if (!reqModalUser) return;
    const msg = reqMsg.trim();
    if (!msg) { showToast("Please add a message", "error"); return; }

    if (exchangeType === "coin") {
      if (myCoins < 3) { showToast("Not enough Skill Coins!", "error"); return; }
      updateCoins(-3);
      showToast("3 Skill Coins spent · Request sent ✓", "success");
    } else {
      showToast(`Request sent to ${reqModalUser.name} ✓`, "success");
    }

    const offer = exchangeType === "swap" ? reqOfferSel : null;
    const want = exchangeType === "swap" ? reqWantSel : reqCoinWantSel;

    setRequests((rs) => [...rs, {
      id: nextId.current++, fromId: reqModalUser.id, toId: reqModalUser.id,
      offer, want, type: exchangeType, msg, time: "Just now", status: "sent",
    }]);
    setSentSet((s) => new Set(s).add(reqModalUser.id));
    closeReqModal();
  }

  /* ---------- profile: add/remove skills ---------- */
  function addSkill(type, value) {
    const v = value.trim();
    if (!v) return;
    const arr = type === "offer" ? myOffers : myWants;
    if (arr.some((s) => s.toLowerCase() === v.toLowerCase())) {
      showToast("Already in your list");
      return;
    }
    if (type === "offer") {
      setMyOffers((o) => [...o, v]);
      updateCoins(1); // reward for adding something you can teach
      showToast(`${v} added · +1 Skill Coin ◈`, "success");
    } else {
      setMyWants((w) => [...w, v]);
      showToast(`${v} added ✓`, "success");
    }
  }

  function removeSkill(type, index) {
    const arr = type === "offer" ? myOffers : myWants;
    const removed = arr[index];
    if (type === "offer") setMyOffers((o) => o.filter((_, i) => i !== index));
    else setMyWants((w) => w.filter((_, i) => i !== index));
    showToast(`${removed} removed`);
  }

  /* ---------- requests page ---------- */
  const [activeReqTab, setActiveReqTab] = useState("incoming");
  const [decliningId, setDecliningId] = useState(null);

  function acceptReq(id) {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
    updateCoins(2);
    showToast("Exchange accepted! +2 Skill Coins ◈", "success");
  }

  function declineReq(id) {
    setDecliningId(id);
    // matches the fade so the card doesn't just vanish
    setTimeout(() => {
      setRequests((rs) => rs.filter((r) => r.id !== id));
      setDecliningId(null);
    }, 400);
  }

  const incomingCount = requests.filter((r) => r.status === "incoming").length;

  /* ---------- schedule page ---------- */
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4); // 0-indexed: 4 = May
  const [selectedDate, setSelectedDate] = useState(null);

  function changeMonth(direction) {
    const d = new Date(calYear, calMonth + direction, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  }
  function selectDay(d) { setSelectedDate({ d, m: calMonth, y: calYear }); }

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessWith, setSessWith] = useState(USERS[0]?.name || "");
  const [sessSkill, setSessSkill] = useState("");
  const [sessDate, setSessDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessTime, setSessTime] = useState("");
  const [sessDur, setSessDur] = useState(60);

  function bookSession() {
    const skill = sessSkill.trim();
    if (!skill || !sessDate || !sessTime) { showToast("Please fill in all fields", "error"); return; }
    setSessions((s) => [...s, {
      id: nextId.current++, with: sessWith, skill, date: sessDate, time: sessTime, dur: sessDur,
      color: getAvatarColor(sessWith), reviewed: false,
    }]);
    setSessionModalOpen(false);
    showToast(`Session booked with ${sessWith} ✓`, "success");
  }

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSessionId, setReviewSessionId] = useState(null);
  const [reviewStar, setReviewStar] = useState(0);

  function openReview(sessionId) {
    setReviewSessionId(sessionId);
    setReviewStar(0);
    setReviewModalOpen(true);
  }

  function submitReview() {
    if (!reviewStar) { showToast("Please select a rating", "error"); return; }
    setSessions((ss) => ss.map((s) => (s.id === reviewSessionId ? { ...s, reviewed: true } : s)));
    updateCoins(1);
    setReviewModalOpen(false);
    showToast("Review submitted · +1 Skill Coin ◈", "success");
  }

  const reviewSession = sessions.find((s) => s.id === reviewSessionId);

  /* ---------- discover: filtered/sorted list ---------- */
  let discoverList = [...USERS];
  if (activeTag) {
    discoverList = discoverList.filter((u) =>
      [...u.offers, ...u.wants].some((s) => s.toLowerCase().includes(activeTag.toLowerCase()))
    );
  }
  if (search) {
    const q = search.toLowerCase();
    discoverList = discoverList.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.dept.toLowerCase().includes(q) ||
      [...u.offers, ...u.wants].some((s) => s.toLowerCase().includes(q))
    );
  }
  discoverList.sort((a, b) => calcMatch(b, myOffers, myWants) - calcMatch(a, myOffers, myWants));

  return (
    <div className="bg-white text-[#111111] min-h-screen">
      <Nav page={page} nav={nav} search={search} setSearch={setSearch} myCoins={myCoins} incomingCount={incomingCount} />

      {page === "discover" && (
        <DiscoverPage
          list={discoverList}
          myOffers={myOffers} myWants={myWants}
          activeTag={activeTag} setTag={setTag}
          sentSet={sentSet} onRequest={openReqModal}
        />
      )}
      {page === "profile" && (
        <ProfilePage
          myOffers={myOffers} myWants={myWants} myCoins={myCoins} sessionsCount={sessions.length}
          onAddSkill={addSkill} onRemoveSkill={removeSkill} nav={nav}
        />
      )}
      {page === "requests" && (
        <RequestsPage
          requests={requests} activeReqTab={activeReqTab} setActiveReqTab={setActiveReqTab}
          incomingCount={incomingCount} onAccept={acceptReq} onDecline={declineReq} decliningId={decliningId}
        />
      )}
      {page === "schedule" && (
        <SchedulePage
          calYear={calYear} calMonth={calMonth} selectedDate={selectedDate}
          sessions={sessions} onChangeMonth={changeMonth} onSelectDay={selectDay}
          onOpenSessionModal={() => setSessionModalOpen(true)} onOpenReview={openReview}
        />
      )}

      <RequestModal
        open={reqModalOpen} user={reqModalUser} myOffers={myOffers}
        exchangeType={exchangeType} setExchangeType={setExchangeTypeState}
        offerSel={reqOfferSel} setOfferSel={setReqOfferSel}
        wantSel={reqWantSel} setWantSel={setReqWantSel}
        coinWantSel={reqCoinWantSel} setCoinWantSel={setReqCoinWantSel}
        msg={reqMsg} setMsg={setReqMsg}
        myCoins={myCoins} onClose={closeReqModal} onSend={sendRequest}
      />

      <SessionModal
        open={sessionModalOpen} onClose={() => setSessionModalOpen(false)}
        withUser={sessWith} setWithUser={setSessWith}
        skill={sessSkill} setSkill={setSessSkill}
        date={sessDate} setDate={setSessDate}
        time={sessTime} setTime={setSessTime}
        dur={sessDur} setDur={setSessDur}
        onBook={bookSession}
      />

      <ReviewModal
        open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}
        session={reviewSession} star={reviewStar} setStar={setReviewStar}
        onSubmit={submitReview}
      />

      <Toast show={toast.show} msg={toast.msg} type={toast.type} />
    </div>
  );
}
