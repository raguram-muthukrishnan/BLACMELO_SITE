import type {MetaFunction} from 'react-router';
import vaultStyles from '~/styles/pages/vault.css?url';
import bannerImage from '~/assets/banner images/3.jpeg';

export const links = () => [
  {rel: 'stylesheet', href: vaultStyles},
];

export const meta: MetaFunction = () => {
  return [
    {title: `BLACMELO | The Vault`},
    {
      name: 'description',
      content: 'The Vault is closed.',
    },
  ];
};

export default function Vault() {
  return (
    <div className="vault-page">
      <section
        className="vault-hero-banner"
        style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bannerImage})`}}
      >
        <div className="vault-hero-overlay">
          <h1 className="vault-hero-title">THE VAULT IS CLOSED</h1>
        </div>
      </section>
    </div>
  );
}
