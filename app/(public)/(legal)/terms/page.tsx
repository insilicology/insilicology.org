import React from 'react';

export const metadata = {
  title: "Terms of Service - Insilicology",
  description: "Read the terms of service for using Insilicology's educational platform and services.",
  keywords: ["insilicology", "terms of service", "insilicology terms", "educational terms", "platform terms"],
  metadataBase: new URL("https://insilicology.org"),
  alternates: {
    canonical: `/terms`,
  },
};

export default function TermsOfService() {
  return (
    <section className="space-y-6">
      <div className="max-w-4xl mx-auto py-16 px-3 sm:px-8 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>

        <p className="text-lg text-gray-700">
          Welcome to Insilicology! These Terms of Service (&quot;Terms&quot;) govern your use of our educational platform and services. By accessing or using our website at https://insilicology.org, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing and using Insilicology&apos;s website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms. These Terms constitute a legally binding agreement between you and Insilicology regarding your use of our educational platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">2. Description of Services</h2>
        <p className="text-gray-700">
          Insilicology provides an online educational platform that offers:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Online courses and educational content</li>
          <li>Live and recorded learning sessions</li>
          <li>Certification programs</li>
          <li>Educational resources and materials</li>
          <li>Community forums and discussion boards</li>
          <li>Assessment and evaluation tools</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">3. User Accounts and Registration</h2>
        <h3 className="text-xl font-medium text-gray-800 mt-6">3.1 Account Creation</h3>
        <p className="text-gray-700">
          To access certain features of our platform, you may be required to create an account. You agree to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and update your account information to keep it accurate and current</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities that occur under your account</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mt-6">3.2 Account Security</h3>
        <p className="text-gray-700">
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other security breach.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">4. Acceptable Use Policy</h2>
        <p className="text-gray-700">
          You agree to use our platform only for lawful purposes and in accordance with these Terms. You agree not to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Use the platform for any illegal or unauthorized purpose</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Upload, post, or transmit harmful, offensive, or inappropriate content</li>
          <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
          <li>Interfere with or disrupt the platform&apos;s functionality</li>
          <li>Use automated systems to access the platform without our permission</li>
          <li>Share your account credentials with others</li>
          <li>Attempt to reverse engineer or copy our platform&apos;s code or content</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">5. Intellectual Property Rights</h2>
        <h3 className="text-xl font-medium text-gray-800 mt-6">5.1 Our Content</h3>
        <p className="text-gray-700">
          All content on our platform, including but not limited to text, graphics, images, videos, audio, software, and course materials, is owned by Insilicology or our licensors and is protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">5.2 License to Use</h3>
        <p className="text-gray-700">
          We grant you a limited, non-exclusive, non-transferable license to access and use our platform and content for educational purposes only. This license does not include the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Reproduce, distribute, or publicly display our content</li>
          <li>Create derivative works based on our content</li>
          <li>Use our content for commercial purposes</li>
          <li>Remove or alter any copyright or proprietary notices</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mt-6">5.3 User-Generated Content</h3>
        <p className="text-gray-700">
          You retain ownership of any content you submit to our platform. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and distribute your content in connection with our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">6. Payment Terms</h2>
        <h3 className="text-xl font-medium text-gray-800 mt-6">6.1 Course Fees</h3>
        <p className="text-gray-700">
          Some courses and services may require payment. All fees are stated in the applicable currency and are non-refundable unless otherwise specified in our Refund Policy.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">6.2 Payment Processing</h3>
        <p className="text-gray-700">
          Payments are processed through secure third-party payment processors. By making a payment, you authorize us to charge your payment method for the specified amount.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">7. Privacy and Data Protection</h2>
        <p className="text-gray-700">
          Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">8. Disclaimers and Limitations</h2>
        <h3 className="text-xl font-medium text-gray-800 mt-6">8.1 Service Availability</h3>
        <p className="text-gray-700">
          We strive to maintain the availability of our platform, but we do not guarantee uninterrupted access. We may temporarily suspend or restrict access for maintenance, updates, or other reasons.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">8.2 Educational Content</h3>
        <p className="text-gray-700">
          While we strive to provide accurate and up-to-date educational content, we do not guarantee the accuracy, completeness, or usefulness of any information on our platform. Educational outcomes may vary based on individual effort and circumstances.
        </p>

        <h3 className="text-xl font-medium text-gray-800 mt-6">8.3 Limitation of Liability</h3>
        <p className="text-gray-700">
          To the maximum extent permitted by law, Insilicology shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our platform or services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">9. Termination</h2>
        <p className="text-gray-700">
          We may terminate or suspend your account and access to our services at any time, with or without cause, with or without notice. Upon termination, your right to use our services will cease immediately.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">10. Governing Law and Dispute Resolution</h2>
        <p className="text-gray-700">
          These Terms are governed by and construed in accordance with the laws of the jurisdiction where Insilicology operates. Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration or in the courts of that jurisdiction.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">11. Changes to Terms</h2>
        <p className="text-gray-700">
          We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of our services after such changes constitutes acceptance of the new Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8">12. Contact Information</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p className="text-gray-700">
            <strong>Email:</strong> <a href="mailto:insilicology@gmail.com" className="text-blue-600 hover:text-blue-800">insilicology@gmail.com</a><br/>
            <strong>Website:</strong> <a href="https://insilicology.org" className="text-blue-600 hover:text-blue-800">https://insilicology.org</a>
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600">
            <strong>Last Updated:</strong> December 2024
          </p>
        </div>
      </div>
    </section>
  );
}