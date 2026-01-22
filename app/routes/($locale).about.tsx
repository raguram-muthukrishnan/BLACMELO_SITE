import {type MetaFunction} from 'react-router';

export const meta: MetaFunction = () => {
  return [{title: 'About Us'}];
};

export default function About() {
  return (
    <div className="about-page">
      <h1>About Us</h1>
      <div className="about-content">
        <p>
          Welcome to our store. We are dedicated to providing you with the best
          products and exceptional customer service.
        </p>
        <p>
          Our mission is to deliver quality products that enhance your lifestyle
          and bring joy to your everyday experiences.
        </p>
      </div>
    </div>
  );
}
