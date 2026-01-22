import {type MetaFunction} from 'react-router';
import {Button} from '~/components/ui/Button';

export const meta: MetaFunction = () => {
  return [{title: 'Contact Us'}];
};

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-content">
        <p>Have questions? We'd love to hear from you.</p>
        
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
            />
          </div>
          
          <Button type="submit" variant="primary">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
