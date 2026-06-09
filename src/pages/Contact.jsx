import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

import { FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-surface-400 max-w-xl mx-auto">Have a question or concern? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-xl font-semibold text-white">Send Us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    className="input-field w-full" />
                </div>
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                  className="input-field w-full" />
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                  className="input-field w-full" />
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card p-6 hover:border-surface-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                  <HiOutlineMail className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                  <p className="text-surface-400">kicksshop1@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="card p-6 hover:border-surface-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                  <HiOutlinePhone className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                  <p className="text-surface-400">+250 781 089 893</p>
                </div>
              </div>
            </div>
            <div className="card p-6 hover:border-surface-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                  <HiOutlineLocationMarker className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                  <p className="text-surface-400">Downtown, Nyarugenge</p>
                  <p className="text-surface-400">Kigali, Rwanda</p>
                </div>
              </div>
            </div>
            <a href="https://www.instagram.com/kick_s_shop1/" target="_blank" rel="noopener noreferrer" className="card p-6 hover:border-surface-600 transition-all block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                  <FaInstagram className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Instagram</h3>
                  <p className="text-surface-400">@kick_s_shop1</p>
                  <p className="text-surface-500 text-sm">Follow us for latest drops & deals</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
