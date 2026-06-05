export default function CtaBand() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <div className="cta__title">
          Lead the Diagnostic Revolution.
          <br />
          Transform today. Innovate tomorrow.
        </div>
        <button className="cta__btn" type="button">
          <span className="cta__btn__label">CONNECT WITH US</span>
          <span className="cta__btn__icon" aria-hidden="true">
            <img className="cta__btn__icon-default" src="/assets/imgGroup.svg" alt="" />
            <img className="cta__btn__icon-hover" src="/assets/imgGroupCtaHover.svg" alt="" />
          </span>
        </button>
      </div>
    </section>
  );
}
