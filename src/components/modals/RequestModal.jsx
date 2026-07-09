import Avatar from "../Avatar.jsx";
import ModalShell from "./ModalShell.jsx";

/**
 * RequestModal allows users to initiate a skill exchange request with another user.
 * It supports two modes:
 * 1. "swap" - exchange teaching a skill in return for learning a skill.
 * 2. "coin" - spend skill coins to learn a skill without offering a skill in return.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Object} props.user - The target user object we are requesting an exchange with.
 * @param {Array<string>} props.myOffers - List of skills that the current user can offer/teach.
 * @param {string} props.exchangeType - Active mode ("swap" or "coin").
 * @param {function} props.setExchangeType - State setter to update the active mode.
 * @param {string} props.offerSel - The skill current user is offering to teach (swap mode).
 * @param {function} props.setOfferSel - State setter for the offered skill.
 * @param {string} props.wantSel - The skill current user wants to learn from target user (swap mode).
 * @param {function} props.setWantSel - State setter for the wanted skill.
 * @param {string} props.coinWantSel - The skill current user wants to learn (coin mode).
 * @param {function} props.setCoinWantSel - State setter for the wanted skill in coin mode.
 * @param {string} props.msg - Personalized message body text.
 * @param {function} props.setMsg - State setter for the message text.
 * @param {number} props.myCoins - The count of skill coins the current user possesses.
 * @param {function} props.onClose - Callback triggered when the modal is closed/cancelled.
 * @param {function} props.onSend - Callback triggered when the request is confirmed and sent.
 */
export default function RequestModal({
  open, user, myOffers,
  exchangeType, setExchangeType,
  offerSel, setOfferSel,
  wantSel, setWantSel,
  coinWantSel, setCoinWantSel,
  msg, setMsg,
  myCoins, onClose, onSend,
}) {
  // If the user has no offers defined, guide them to add skills first
  const offerOptions = myOffers.length ? myOffers : ["Add skills to your profile first"];
  // Retrieve the skills offered by the user we are requesting from
  const theirOptions = user ? user.offers : [];

  return (

    <ModalShell open={open} title="Request a skill exchange" onClose={onClose}>
      {user && (
        <div className="flex items-center gap-3 p-3.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl mb-4">
          <Avatar name={user.name} initials={user.initials} size="sm" />
          <div>
            <div className="font-semibold text-sm">{user.name}</div>
            <div className="text-xs text-[#999]">★ {user.rating} · {user.reviews} reviews</div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="mo-label">Exchange type</label>
        <div className="flex gap-1.5 bg-[#FAFAFA] p-1 rounded-2xl border border-[#E5E5E5]">
          <button className={`etog${exchangeType === "swap" ? " on" : ""}`} onClick={() => setExchangeType("swap")}>
            ⇄ Skill Swap
          </button>
          <button className={`etog${exchangeType === "coin" ? " on" : ""}`} onClick={() => setExchangeType("coin")}>
            ◈ Use Coins
          </button>
        </div>
      </div>

      {exchangeType === "swap" ? (
        <>
          <div className="mo-field">
            <label className="mo-label">I'll teach you</label>
            <select className="mo-select" value={offerSel} onChange={(e) => setOfferSel(e.target.value)}>
              {offerOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="mo-field">
            <label className="mo-label">In exchange for</label>
            <select className="mo-select" value={wantSel} onChange={(e) => setWantSel(e.target.value)}>
              {theirOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="mo-field">
            <label className="mo-label">Skill you want to learn</label>
            <select className="mo-select" value={coinWantSel} onChange={(e) => setCoinWantSel(e.target.value)}>
              {theirOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-3.5 py-2.5 mb-3 text-xs text-amber-700">
            ◈ Costs 3 Skill Coins · You have <strong>{myCoins}</strong>
          </div>
        </>
      )}

      <div className="mo-field">
        <label className="mo-label">Message</label>
        <textarea
          className="mo-textarea"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Introduce yourself — what do you want to learn and what can you offer?"
        />
      </div>

      <div className="mo-actions">
        <button className="mo-cancel" onClick={onClose}>Cancel</button>
        <button className="mo-confirm" onClick={onSend}>Send Request →</button>
      </div>
    </ModalShell>
  );
}
