"use client";

export default function SideBarFooter() {
  return (
    <div className="side-bar__footer">
      <div aria-label="Інформація про користувача" className="side-bar__bottom">
        <p>
          <strong>Wallet:</strong> <span className="text-purple-400 font-black"> 0xA34f...9B21</span>
        </p>
      </div>
    </div>
  );
}
