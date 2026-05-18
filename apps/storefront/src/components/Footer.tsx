import { Link } from 'react-router'
import footerData from '@/data/footer.json'

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'Instagram') {
    return (
      <svg className="y6rh0 x215h" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    )
  }

  if (icon === 'Twitter') {
    return (
      <svg className="y6rh0 xqxx6" width="48" height="50" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.5665 20.7714L46.4356 0H42.2012L26.6855 18.0355L14.2931 0H0L18.7397 27.2728L0 49.0548H4.23464L20.6196 30.0087L33.7069 49.0548H48L28.5655 20.7714H28.5665ZM22.7666 27.5131L5.76044 3.18778H12.2646L42.2032 46.012H35.699L22.7666 27.5142V27.5131Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className="y6rh0 x215h" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

export default function Footer() {
  const { newsletter, sections, location, feedback, socialLinks, bottom } = footerData
  const displaySections = sections.slice(0, 2)

  return (
    <footer className="mt-auto rvoqh r4caq qbzlc">
      <div className="w-full max-w-[85rem] mx-auto ei6q1 nirzj cti9j gwqpr c4mnv">
        <div className="njjrs flex flex-col oskez">
          <div className="b70oy">
            <label htmlFor="homepage-footer-email" className="block wgwtz at2zb c4t4j">
              {newsletter.label}
            </label>

            <div className="flex items-center osjzw">
              <input
                id="homepage-footer-email"
                type="text"
                className="dvh79 cti9j block w-full robkw x3ljb edpyz rbu8c c4t4j qnoha ajd3x jobdj disabled:opacity-50 disabled:pointer-events-none"
                placeholder={newsletter.placeholder}
              />
              <button type="button" className="dvh79 cti9j offh6 inline-flex lp3ls items-center my9gz rbu8c at2zb edpyz pm6ks mak94 ve4ck bni17 pucrg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden soa63">
                {newsletter.buttonText}
              </button>
            </div>
          </div>
        </div>

        <div className="tex4h da7vf u7utu c3uoj q3gap qyakg">
          {displaySections.map((section: any) => (
            <div key={section.title}>
              <h4 className="a3olr at2zb yymkp c4t4j">{section.title}</h4>

              <ul className="tex4h space-y-2">
                {section.links.map((link: any) => (
                  <li key={link.label}>
                    <Link className="yymkp f1ztf a8v2i lpc02 cihbd focus:outline-hidden jnkmc hj22m" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-10">
            <div className="space-y-3">
              <button type="button" className="flex items-center i220p m4rra yymkp c4t4j oxpaq focus:outline-hidden rjy76">
                <svg className="y6rh0 xqxx6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location.label}
                <svg className="y6rh0 x215h" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <button type="button" className="flex items-center i220p m4rra yymkp c4t4j oxpaq focus:outline-hidden rjy76">
                <svg className="y6rh0 xqxx6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                {location.value}
                <svg className="y6rh0 x215h" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <button type="button" className="flex items-center i220p m4rra yymkp c4t4j oxpaq focus:outline-hidden rjy76">
                <svg className="y6rh0 xqxx6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {feedback.label}
                <svg className="y6rh0 x215h" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div>
              <h4 className="at2zb yymkp c4t4j">Stay connected</h4>

              <div className="ljp3z qb57m space-x-4">
                {socialLinks.map((link: any) => (
                  <Link
                    key={link.label}
                    className="relative inline-block yymkp f1ztf a8v2i lpc02 cihbd focus:outline-hidden jnkmc hj22m"
                    to={link.href}
                  >
                    <SocialIcon icon={link.icon} />
                    <span className="rfrdb">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[85rem] pwc5m u3wpp mx-auto cti9j gwqpr c4mnv">
          <ul className="flex flex-wrap items-center offh6 oskez">
            <li className="inline-flex items-center relative m859b f1ztf jr33k qt51h last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-surface-3 after:rounded-full after:-translate-y-1/2">
              {bottom.copyright}
            </li>
            {bottom.links.map((link: any) => (
              <li
                key={link.label}
                className="inline-flex items-center relative m859b f1ztf jr33k qt51h last:after:hidden after:absolute after:top-1/2 after:end-0 after:inline-block after:size-[3px] after:bg-surface-3 after:rounded-full after:-translate-y-1/2"
              >
                <Link className="m859b f1ztf a8v2i lpc02 cihbd focus:outline-hidden jnkmc hj22m" to={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
