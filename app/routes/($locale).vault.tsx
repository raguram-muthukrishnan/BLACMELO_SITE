import type {MetaFunction} from 'react-router';
import vaultStyles from '~/styles/pages/vault.css?url';

export const links = () => [
  {rel: 'stylesheet', href: vaultStyles},
];

export const meta: MetaFunction = () => {
  return [
    {title: `BLACMELO | The Vault`},
    {
      name: 'description',
      content: 'Exclusive access to The Vault - Premium collections and early releases.',
    },
  ];
};

export default function Vault() {
  return (
    <div className="vault-page">
      {/* Vault Closed Banner */}
      <section className="vault-hero-banner">
        <div className="vault-hero-overlay">
          <h1 className="vault-hero-title">THE VAULT IS CLOSED</h1>
          <a href="#signup" className="vault-signup-link">
            <span className="vault-signup-arrow">→</span>
            <span className="vault-signup-text">SIGN UP FOR EXCLUSIVE ACCESS</span>
          </a>
        </div>
      </section>
    </div>
  );
}
