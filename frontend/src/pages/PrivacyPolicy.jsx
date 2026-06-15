import React from 'react';
import { Link } from 'react-router-dom';
const sectionStyle = {
  marginBottom: '28px',
  padding: '24px',
  borderRadius: '16px',
  background: '#fff',
  border: '1px solid rgba(117, 2, 80, 0.08)',
  boxShadow: '0 14px 36px rgba(0,0,0,0.04)'
};
const headingStyle = {
  marginTop: 0,
  marginBottom: '12px',
  color: 'var(--primary)',
  fontSize: '18px',
  fontWeight: 800
};
export default function PrivacyPolicy() {
  const effectiveDate = 'April 26, 2026';
  return (
    <div className="container section" style={{ maxWidth: '920px' }}>
      <div style={{ marginBottom: '34px' }}>
        <p className="label" style={{ color: 'var(--primary)' }}>Data Governance</p>
        <h1 style={{ marginBottom: '12px' }}>Privacy Policy</h1>
        <p style={{ maxWidth: '760px', lineHeight: 1.7, color: '#555' }}>
          At <span className="notranslate" translate="no">Createam</span>, we prioritize the confidentiality and safety of your data. This policy details how we handle information across our public site and internal production dashboards.
        </p>
        <p style={{ fontSize: '13px', color: '#888' }}>Last Updated: {effectiveDate}</p>
      </div>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. Data Collection Categories</h2>
        <p><strong>Professional Inquiries:</strong> We collect names, emails, and project details submitted through our "Lead" management system.</p>
        <p><strong>Performance Tracking:</strong> We track interactive engagement (clicks) on our Partnership showcase. To ensure privacy while maintaining performance insights, we primarily focus on activity from the <strong>last 3 months</strong>.</p>
        <p><strong>Studio Authentication:</strong> For invited Project Managers and Members, we collect account details required for role-based dashboard access.</p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. Geolocation and Mapping</h2>
        <p>
          We utilize geocoding technology (via Nominatim and OpenStreetMap) to project-manage client locations. This process may involve converting physical addresses into geographic coordinates. We do not store precise GPS data of individuals; only professional client locations for project visualization.
        </p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. Use of Information</h2>
        <ul style={{ lineHeight: 1.8, color: '#444' }}>
          <li>Operationalizing task management and project finalization workflows.</li>
          <li>Generating automated invitation credentials for new studio staff.</li>
          <li>Analyzing 90-day performance trends for our creative partnerships.</li>
          <li>Sending critical project status updates (e.g., "Ready for Review" notifications).</li>
        </ul>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. Data Security and Cookies</h2>
        <p>
          We use secure local storage for session persistence and role-based access control. Critical actions, such as project archiving or user deletion, are logged and restricted to Administrative accounts.
        </p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. Storage and Retention</h2>
        <p>
          Lead inquiries are stored until resolved or archived. Active project data is maintained throughout the production cycle. Archived projects remain in our showcase to demonstrate agency expertise unless a client requests removal.
        </p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. Third-Party Integrations</h2>
        <p>
          Our platform integrates with external hosting, mail servers, and mapping providers. These partners handle data according to their own privacy standards, which we periodically review for compliance.
        </p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. Your Data Rights</h2>
        <p>
          You may request a summary of the data we hold regarding your professional inquiry or account status. For data removal requests, please contact our privacy officer.
        </p>
      </section>
      <section style={sectionStyle}>
        <h2 style={headingStyle}>8. Contact</h2>
        <p>
          Questions regarding data handling can be directed to{' '}
          <a href="mailto:contact@createam.tn" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            contact@createam.tn
          </a>
          .
        </p>
      </section>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px' }}>
        <Link to="/terms-of-service" className="btn">Terms of Service</Link>
        <Link to="/contact" className="btn" style={{ background: '#111' }}>Support</Link>
      </div>
    </div>
  );
}
