export function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid foot-grid--4">
            <div>
              <span className="logo-chip"><img src="/assets/logo.png" alt="Divergent Classes" width="227" height="88" loading="lazy" /></span>
              <p className="foot-about">Online coaching for UCEED, NID and NIFT, by mentors from IIT, NID and NIFT.</p>
              <ul className="foot-contact">
                <li><svg width="18" height="18" aria-hidden="true"><use href="#i-mail" /></svg><a href="mailto:support@divergentclasses.com">support@divergentclasses.com</a></li>
                <li><svg width="18" height="18" aria-hidden="true"><use href="#i-phone" /></svg><span><a href="tel:+918383056332">+91 83830 56332</a> · <a href="tel:+918368033468">+91 83680 33468</a></span></li>
              </ul>
            </div>
            <div>
              <h3>Explore</h3>
              <ul>
                <li><a href="/courses/">Courses</a></li>
                <li><a href="/results/">Results</a></li>
                <li><a href="/about/">About us</a></li>
                <li><a href="/contact/">Contact us</a></li>
              </ul>
            </div>
            <div>
              <h3>Exams</h3>
              <ul>
                <li><a href="/uceed/">UCEED</a></li>
                <li><a href="/nid/">NID DAT</a></li>
                <li><a href="/nift/">NIFT</a></li>
                <li><a href="/#plans">75-day crash course</a></li>
              </ul>
            </div>
            <div>
              <h3>Community</h3>
              <ul className="foot-social">
                <li><a href="https://www.instagram.com/divergent.classes/" target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-camera" /></svg>Instagram</a></li>
                <li><a href="https://t.me/divergent_classes" target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-send" /></svg>Telegram</a></li>
                <li><a href="https://chat.whatsapp.com/FnxxwZ83RqVBQsMtjqLiRh" target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-chat" /></svg>WhatsApp</a></li>
                <li><a href="https://www.linkedin.com/company/divergent-classes/" target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-in" /></svg>LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="legal">
            <p>Ranks shown are official UCEED, NID and NIFT results of Divergent students.</p>
            <p className="legal-links"><a href="/terms/">Terms and conditions</a><a href="/privacy/">Privacy policy</a></p>
            <p>© <span data-year="">2026</span> Divergent Classes</p>
          </div>
        </div>
      </footer>

      <a className="wa-float" href="https://wa.me/918383056332?text=Hi%2C%20I%20would%20like%20to%20talk%20to%20a%20counsellor" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg width="24" height="24" aria-hidden="true"><use href="#i-chat" /></svg></a>
    </>
  );
}
