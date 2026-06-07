export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__truck">
        <img src="/assets/img1801.png" alt="" />
      </div>
      <div className="footer__panel">
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__heading">
              <span className="g">Sense The Future.</span>
              <span className="w">Inspire The Now.</span>
            </div>

            <div className="footer__right">
              <div className="footer__contact">
                <div className="ttl">CONTACT US</div>
                <div className="line phone">
                  <img src="/assets/imgGroup7.svg" alt="" />
                  <div className="col">
                    <p>+91-098765432</p>
                    <p>1800 5678 9002</p>
                  </div>
                </div>
                <div className="line mail">
                  <img src="/assets/imgVector5.svg" alt="" />
                  <div className="col">
                    <p>
                      AP_DIIN_SENSESALES@APDENSO.CPM
                      <br />
                      (SALES)
                    </p>
                    <p>
                      AP_DIIN_SENSESALES@APDENSO.CPM
                      <br />
                      (SUPPORT)
                    </p>
                  </div>
                </div>
              </div>

              <div className="footer__social">
                <a className="soc" href="https://www.linkedin.com/company/@densosense" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <img className="circle" src="/assets/imgVector3.svg" alt="" />
                  <img className="glyph" src="/assets/imgGroup2.svg" alt="" style={{ width: "13.5px", height: "13.4px" }} />
                </a>
                <a className="soc" href="https://www.facebook.com/@densosense" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <img className="full" src="/assets/imgGroup3.svg" alt="" />
                </a>
                <a className="soc" href="https://www.youtube.com/channel/UCsRkEOhNRhgqTU0-zfJh82g" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <img className="circle" src="/assets/imgVector3.svg" alt="" />
                  <img className="glyph" src="/assets/imgGroup4.svg" alt="" style={{ width: "17.7px", height: "12.6px" }} />
                </a>
                <a className="soc" href="https://www.instagram.com/densosense?igsh=MW4zaTBvNjNzMHR4bg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img className="full" src="/assets/imgGroup5.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__meta">
          <div className="footer__logostrip">
            <div className="footer__logo-cell">
              <div className="footer__senselogo">
                <img src="/assets/imgGroup6.svg" alt="sense" width={114} height={19} />
              </div>
            </div>
          </div>
          <div className="footer__bar">
            <span className="cp">COPYRIGHT DENSO SENSE</span>
            <span className="yr">2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
