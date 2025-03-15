import Head from "next/head";

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us | Your Company Name</title>
        <meta
          name="description"
          content="Learn more about Your Company Name, our mission, our team, and our values."
        />
      </Head>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl mb-8">
            We are Your Company Name – a leading provider of innovative financial solutions designed to empower investors and simplify portfolio management.
          </p>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                Our mission is to help users optimize their portfolios using cutting-edge optimization strategies. We simplify complex financial data into actionable insights so you can make informed investment decisions and maximize returns.
              </p>
            </div>
            <div>
              <img
                src="/images/about-mission.jpg"
                alt="Our Mission"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <h2 className="text-2xl font-bold mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/images/team1.jpg"
                  alt="John Doe"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">John Doe</h3>
                <p className="text-gray-600">CEO &amp; Founder</p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/images/team2.jpg"
                  alt="Jane Smith"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Jane Smith</h3>
                <p className="text-gray-600">Chief Technology Officer</p>
              </div>
              {/* Team Member 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/images/team3.jpg"
                  alt="Michael Lee"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Michael Lee</h3>
                <p className="text-gray-600">Head of Product</p>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Section */}
<section className="py-12 bg-gray-200">
  <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 text-center">
    <h2 className="text-2xl font-bold mb-4">Support Our Mission</h2>
    <p className="text-lg mb-8">
      Your donation helps us continue to develop advanced portfolio optimization tools that empower investors worldwide.
    </p>
    <form
      action="https://www.paypal.com/cgi-bin/webscr"
      method="post"
      target="_blank"
      className="inline-block"
    >
      <input type="hidden" name="cmd" value="_donations" />
      <input type="hidden" name="business" value="dummy@example.com" />
      <input
        type="hidden"
        name="item_name"
        value="Support Our Portfolio Optimization Mission"
      />
      <input type="hidden" name="currency_code" value="USD" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
        name="submit"
        alt="Donate with PayPal button"
        style={{ border: 0 }}
      />
      <img
        alt=""
        src="https://www.paypal.com/en_US/i/scr/pixel.gif"
        width="1"
        height="1"
        style={{ border: 0 }}
      />
    </form>
  </div>
</section>


        {/* Contact Section */}
        <section className="py-12 bg-gray-200">
          <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg mb-8">
              Have questions or need support? We’d love to hear from you!
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
