export const CONTACT = {
  phone: '+91 81091 01811',
  phoneHref: 'tel:+918109101811',
  whatsapp: 'https://wa.me/918109101811',
  email: 'indore@quickconsulting.in',
  address: 'M9, Bapat Road, Near Brilliant Aura, Above Mapple Kitchens, Vijay Nagar, Indore',
  mapsUrl: 'https://maps.app.goo.gl/fD9ppKFtUCsDKfsF9',
  linkedin: 'https://www.linkedin.com/company/quick-consulting-services/',
  facebook: 'https://www.facebook.com/share/19S8Ai6XH4/',
  instagram:
    'https://www.instagram.com/quick_consulting_services?igsh=eGNlbTJ5anY3YWtv&igsi=eGNlbTJ5anY3YWtv',
  youtube: 'https://youtube.com/@quick_consulting?si=2FQkXe3-3j5kbzm-',
}

export const TRUST_STATS = [
  { icon: 'FaCheckDouble', label: '100% Transparent Pricing' },
  { icon: 'FaUserShield', label: 'Personalized Attention' },
  { icon: 'FaGlobe', label: 'Pan-India Support' },
  { icon: 'counter', target: 7, suffix: '+', label: 'Services Offered' },
]

export const WHY_CHOOSE_US = [
  {
    icon: 'FaUserTie',
    title: 'Expert Team',
    desc: 'Certified professionals with deep industry knowledge.',
    detail: 'Our consultants bring years of hands-on experience across tax, IT, and digital domains — so every recommendation is grounded in real expertise, not guesswork.',
  },
  {
    icon: 'FaStopwatch',
    title: 'Fast Turnaround',
    desc: 'Quick and efficient service delivery without compromising quality.',
    detail: 'Streamlined processes and dedicated teams mean your registration, filing, or project moves fast — without cutting corners on accuracy.',
  },
  {
    icon: 'FaHandshakeAngle',
    title: 'End-to-End Support',
    desc: 'From planning to execution, we are with you at every step.',
    detail: 'We don’t just advise and leave — we stay involved from the first consultation through implementation and beyond, as a true growth partner.',
  },
  {
    icon: 'FaTags',
    title: 'Transparent Pricing',
    desc: 'No hidden fees, just clear and honest pricing models.',
    detail: 'You get a detailed quote upfront, covering every government fee and professional charge — no surprises when the invoice arrives.',
  },
]

export const PROCESS_STEPS = [
  { step: 1, title: 'Understand', desc: 'We define your goals.' },
  { step: 2, title: 'Analyze', desc: 'We assess the landscape.' },
  { step: 3, title: 'Plan', desc: 'We build a custom strategy.' },
  { step: 4, title: 'Implement', desc: 'We execute the solutions.' },
  { step: 5, title: 'Grow', desc: 'Ongoing guidance & scaling.' },
]

export const APPROACH_CARDS = [
  { icon: 'FaFileInvoiceDollar', title: 'Tax Strategy', desc: 'Optimizing liabilities legally and safely.', serviceId: 'tax' },
  { icon: 'FaCode', title: 'Web Dev', desc: 'High-performance digital storefronts.', serviceId: 'web' },
  { icon: 'FaRobot', title: 'AI Automation', desc: 'Streamlining operations with smart tech.', serviceId: 'ai' },
  { icon: 'FaBuilding', title: 'Registration', desc: 'Fast-tracking your legal entity setup.', serviceId: 'reg' },
  { icon: 'FaCalculator', title: 'Accounting', desc: 'Precision bookkeeping and reporting.', serviceId: 'acc' },
  { icon: 'FaReceipt', title: 'GST Compliance', desc: 'End-to-end GST registration & returns.', serviceId: 'tax' },
  { icon: 'FaChartLine', title: 'Business Strategy', desc: 'Growth plans tailored to your market.', serviceId: 'biz' },
]

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'it', label: 'IT & Cloud' },
  { id: 'ai', label: 'AI & Automation' },
  { id: 'web', label: 'Web & Digital' },
  { id: 'tax', label: 'Tax & Compliance' },
  { id: 'reg', label: 'Registration' },
  { id: 'acc', label: 'Accounting' },
  { id: 'biz', label: 'Business Growth' },
]

export const SERVICES = [
  {
    id: 'it',
    icon: 'FaNetworkWired',
    title: 'IT Consulting',
    items: [
      'ERP & SAP Consulting',
      'Power BI & Business Intelligence',
      'Data Analytics',
      'Cloud & Digital Transformation',
    ],
  },
  {
    id: 'ai',
    icon: 'FaRobot',
    title: 'AI & Automation',
    items: [
      'AI Voice Agents',
      'WhatsApp Business Automation',
      'Chatbot Development',
      'Workflow Automation & GenAI',
    ],
  },
  {
    id: 'web',
    icon: 'FaCode',
    title: 'Web & Digital',
    items: [
      'Website Design & Development',
      'E-commerce Development',
      'SEO & Google Business Profile',
      'Digital Marketing & Social Media',
    ],
  },
  {
    id: 'tax',
    icon: 'FaFileInvoiceDollar',
    title: 'Tax & Compliance',
    items: [
      'Income Tax Return (ITR) Filing',
      'GST Registration & GST Return Filing',
      'TDS Return Filing & TDS Compliance',
      'Tax Planning & Advisory',
      'Income Tax Notices & Assessments',
    ],
  },
  {
    id: 'reg',
    icon: 'FaBuilding',
    title: 'Business Registration',
    items: [
      'Proprietorship & Partnership Firm',
      'LLP & Private Limited Company',
      'Startup India & MSME (Udyam)',
      'PAN, TAN & Digital Signature (DSC)',
    ],
  },
  {
    id: 'acc',
    icon: 'FaCalculator',
    title: 'Accounting & Finance',
    items: [
      'Bookkeeping & Accounting',
      'Payroll Processing',
      'Financial Statements',
      'Internal Audit & Virtual CFO',
    ],
  },
  {
    id: 'biz',
    icon: 'FaChartLine',
    title: 'Business Consulting',
    items: [
      'Startup Consulting & Strategy',
      'Business Process Improvement',
      'Project Management Consulting',
      'Government Schemes & Subsidies',
    ],
  },
]

export const TESTIMONIALS = [
  {
    initial: 'R',
    name: 'Rahul Sharma',
    role: 'Founder, TechSolutions',
    quote:
      'Quick Consulting helped us set up our Private Limited company seamlessly and handled all GST registrations. Highly recommended!',
  },
  {
    initial: 'A',
    name: 'Anita Desai',
    role: 'Director, RetailCorp',
    quote:
      'Their AI automation service transformed how we handle customer inquiries on WhatsApp. It saved us countless hours.',
  },
  {
    initial: 'V',
    name: 'Vikram Singh',
    role: 'CEO, BuildRight Infra',
    quote:
      'Excellent tax planning and advisory. They are always available to answer my queries and ensure we stay compliant.',
  },
]

export const FAQS = [
  {
    q: 'How long does business registration take?',
    a: 'Typically, a Private Limited Company or LLP registration takes 7-10 working days, provided all documents are in order. Proprietorships can be faster.',
  },
  {
    q: 'Do you provide ongoing tax filing support?',
    a: 'Yes, we offer monthly and annual retainer packages that cover all your GST, TDS, and Income Tax filing requirements.',
  },
  {
    q: 'Can you automate my customer support on WhatsApp?',
    a: 'Absolutely! Our AI & Automation team specializes in building smart WhatsApp chatbots that can handle FAQs, bookings, and customer support 24/7.',
  },
  {
    q: 'Are there any hidden costs?',
    a: 'No. We pride ourselves on transparent pricing. You will receive a detailed quotation before we begin any work, outlining all government fees and our professional charges.',
  },
  {
    q: 'Can you build a custom web application for my business?',
    a: 'Absolutely! We support clients pan-India and globally via Google Meet, Zoom, and WhatsApp. Most of our services can be completed 100% online.',
  },
]

export const SERVICE_OPTIONS = [
  'Tax & Compliance',
  'Business Registration',
  'Accounting & Finance',
  'IT & Data Analytics',
  'AI & Automation',
  'Web Development',
  'Business Consulting',
]

export const SERVICE_ID_TO_OPTION = {
  it: 'IT & Data Analytics',
  ai: 'AI & Automation',
  web: 'Web Development',
  tax: 'Tax & Compliance',
  reg: 'Business Registration',
  acc: 'Accounting & Finance',
  biz: 'Business Consulting',
}

// NOTE: Owner must review this content before publishing.
export const SERVICE_DETAILS = {
  it: {
    tagline: 'Empowering businesses through digital transformation and data.',
    overview: 'We help modern businesses upgrade their tech stack, from ERP systems to advanced data analytics. This ensures smarter decision-making and efficient operations.',
    offerings: [
      { title: 'ERP & SAP Consulting', desc: 'End-to-end implementation and support for enterprise resource planning.' },
      { title: 'Power BI & Business Intelligence', desc: 'Transform raw data into visual, actionable insights.' },
      { title: 'Data Analytics', desc: 'Deep dive into your data to uncover trends and growth opportunities.' },
      { title: 'Cloud & Digital Transformation', desc: 'Seamlessly migrate to cloud platforms for better scalability.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We understand your current IT infrastructure and business goals.' },
      { title: 'Requirements & Documents', desc: 'We gather necessary access and outline the technical requirements.' },
      { title: 'Execution', desc: 'Our team implements the tailored IT or data solution.' },
      { title: 'Delivery & Ongoing Support', desc: 'We deploy the system and provide continuous maintenance.' },
    ],
    idealFor: ['Mid-to-large enterprises', 'Tech-driven startups'],
    documents: [],
    faqs: [
      { q: 'Do you support custom ERP implementations?', a: 'Yes, we tailor ERP and SAP solutions to fit your specific business processes.' },
      { q: 'Can you help migrate our on-premise data to the cloud?', a: 'Absolutely. We ensure secure and seamless cloud migrations with minimal downtime.' },
    ],
  },
  ai: {
    tagline: 'Automate your operations with intelligent AI solutions.',
    overview: 'We design and deploy AI-driven tools like voice agents and chatbots to streamline customer interactions and internal workflows. This helps reduce manual effort and scale your business faster.',
    offerings: [
      { title: 'AI Voice Agents', desc: 'Smart conversational voicebots for customer support and lead qualification.' },
      { title: 'WhatsApp Business Automation', desc: 'Engage customers 24/7 with automated WhatsApp flows.' },
      { title: 'Chatbot Development', desc: 'Custom chatbots integrated into your website or app.' },
      { title: 'Workflow Automation & GenAI', desc: 'Automate repetitive tasks using generative AI and custom scripts.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We identify processes in your business suitable for automation.' },
      { title: 'Requirements & Documents', desc: 'We map out the conversation flows and necessary API integrations.' },
      { title: 'Execution', desc: 'We develop, train, and test the AI models and automation scripts.' },
      { title: 'Delivery & Ongoing Support', desc: 'We launch the solution and monitor performance for continuous improvement.' },
    ],
    idealFor: ['E-commerce', 'Service providers', 'Customer support teams'],
    documents: [],
    faqs: [
      { q: 'Will the AI sound natural to my customers?', a: 'Yes, we use advanced GenAI models to ensure conversational and natural interactions.' },
      { q: 'Can the chatbot integrate with my CRM?', a: 'We can integrate AI solutions with most popular CRM and software platforms.' },
    ],
  },
  web: {
    tagline: 'Building digital storefronts that drive growth and engagement.',
    overview: 'Our web development and digital marketing services establish your strong online presence. We focus on high-performance websites and effective SEO to attract and retain customers.',
    offerings: [
      { title: 'Website Design & Development', desc: 'Modern, responsive websites tailored to your brand identity.' },
      { title: 'E-commerce Development', desc: 'Robust online stores designed for conversion and scalability.' },
      { title: 'SEO & Google Business Profile', desc: 'Improve search rankings and local visibility.' },
      { title: 'Digital Marketing & Social Media', desc: 'Data-driven campaigns to expand your audience reach.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We discuss your brand vision, target audience, and digital goals.' },
      { title: 'Requirements & Documents', desc: 'We collect branding assets, content, and specific feature requests.' },
      { title: 'Execution', desc: 'Our team designs, develops, and optimizes your digital assets.' },
      { title: 'Delivery & Ongoing Support', desc: 'We launch your website and provide post-launch marketing support.' },
    ],
    idealFor: ['Retail businesses', 'Startups', 'Local service providers'],
    documents: [],
    faqs: [
      { q: 'Are your websites mobile-friendly?', a: 'Yes, all our websites are fully responsive and optimized for mobile devices.' },
      { q: 'Do you provide website maintenance?', a: 'We offer ongoing support and maintenance packages to keep your site secure and up-to-date.' },
    ],
  },
  tax: {
    tagline: 'Simplifying tax compliance so you can focus on business.',
    overview: 'We handle your end-to-end tax responsibilities, from GST returns to complex tax planning. Our goal is to ensure legal compliance while optimizing your tax liabilities safely.',
    offerings: [
      { title: 'Income Tax Return (ITR) Filing', desc: 'Accurate and timely filing of corporate and individual ITRs.' },
      { title: 'GST Registration & GST Return Filing', desc: 'Complete GST compliance, from initial setup to periodic returns.' },
      { title: 'TDS Return Filing & TDS Compliance', desc: 'Managing TDS deductions, payments, and return filings.' },
      { title: 'Tax Planning & Advisory', desc: 'Strategic advice to structure your finances efficiently.' },
      { title: 'Income Tax Notices & Assessments', desc: 'Professional representation and resolution for tax notices.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We review your current tax status and compliance requirements.' },
      { title: 'Requirements & Documents', desc: 'You provide necessary financial records, invoices, and previous returns.' },
      { title: 'Execution', desc: 'We calculate liabilities, prepare filings, and strategize tax savings.' },
      { title: 'Delivery & Ongoing Support', desc: 'We file the returns on your behalf and keep you updated on upcoming deadlines.' },
    ],
    idealFor: ['Corporate entities', 'SMEs', 'Freelancers'],
    documents: ['PAN Card', 'Aadhaar Card', 'Bank Statements', 'Previous Year Returns', 'Invoices'],
    faqs: [
      { q: 'What happens if I miss a tax filing deadline?', a: 'Late filings can attract penalties and interest. We help you file belated returns and minimize penalties.' },
      { q: 'Can you help respond to an Income Tax notice?', a: 'Yes, our experts can draft responses and represent you during tax assessments.' },
    ],
  },
  reg: {
    tagline: 'Fast-tracking your legal entity setup and registrations.',
    overview: 'Starting a business requires solid legal foundations. We assist in registering various business entities and securing essential licenses, making the setup process hassle-free.',
    offerings: [
      { title: 'Proprietorship & Partnership Firm', desc: 'Simple and quick registration for sole owners and partners.' },
      { title: 'LLP & Private Limited Company', desc: 'Incorporation services for structured corporate entities.' },
      { title: 'Startup India & MSME (Udyam)', desc: 'Unlocking government benefits through official startup registrations.' },
      { title: 'PAN, TAN & Digital Signature (DSC)', desc: 'Procuring fundamental tax and digital identity documents.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We advise on the best business structure for your specific needs.' },
      { title: 'Requirements & Documents', desc: 'We collect KYC documents, address proofs, and proposed names.' },
      { title: 'Execution', desc: 'We draft the necessary deeds and file applications with the MCA or local authorities.' },
      { title: 'Delivery & Ongoing Support', desc: 'We hand over the incorporation certificates and assist with post-incorporation compliance.' },
    ],
    idealFor: ['New founders', 'Expanding businesses'],
    documents: ['PAN Card', 'Aadhaar Card', 'Address Proof (Electricity Bill/Rent Agreement)', 'Passport Size Photos', 'Bank Statement'],
    faqs: [
      { q: 'Which business structure is best for a startup?', a: 'Private Limited Company or LLP is generally preferred by startups for funding and limited liability benefits.' },
      { q: 'How long does it take to register a Private Limited Company?', a: 'Typically, it takes a few working days once all documents are verified and submitted.' },
    ],
  },
  acc: {
    tagline: 'Precision bookkeeping and financial reporting.',
    overview: 'Maintain clear and accurate financial records with our professional accounting services. We provide insights into your financial health, helping you make informed business decisions.',
    offerings: [
      { title: 'Bookkeeping & Accounting', desc: 'Day-to-day recording of financial transactions and ledger maintenance.' },
      { title: 'Payroll Processing', desc: 'Timely and compliant salary calculations and disbursals.' },
      { title: 'Financial Statements', desc: 'Preparation of Profit & Loss accounts, Balance Sheets, and Cash Flow statements.' },
      { title: 'Internal Audit & Virtual CFO', desc: 'Deep financial oversight, risk management, and strategic financial planning.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We assess the volume of your transactions and reporting needs.' },
      { title: 'Requirements & Documents', desc: 'You share bank statements, invoices, and expense receipts.' },
      { title: 'Execution', desc: 'We organize your books, reconcile accounts, and prepare draft statements.' },
      { title: 'Delivery & Ongoing Support', desc: 'We provide monthly financial reports and ongoing advisory.' },
    ],
    idealFor: ['Small to Medium Enterprises', 'Corporate branches'],
    documents: ['Bank Statements', 'Purchase/Sales Invoices', 'Expense Receipts', 'Previous Financial Statements'],
    faqs: [
      { q: 'Do you use accounting software like Tally or Zoho?', a: 'Yes, we are proficient in industry-standard accounting software to manage your books efficiently.' },
      { q: 'What is a Virtual CFO?', a: 'A Virtual CFO provides high-level financial strategy, cash flow management, and financial planning on a part-time or outsourced basis.' },
    ],
  },
  biz: {
    tagline: 'Strategic consulting to scale and optimize your business.',
    overview: 'We help businesses identify growth bottlenecks and optimize their processes. From securing subsidies to project management, we are your partners in sustainable growth.',
    offerings: [
      { title: 'Startup Consulting & Strategy', desc: 'Guiding new ventures from ideation to market entry.' },
      { title: 'Business Process Improvement', desc: 'Analyzing and streamlining workflows for maximum efficiency.' },
      { title: 'Project Management Consulting', desc: 'Ensuring timely and within-budget delivery of key business initiatives.' },
      { title: 'Government Schemes & Subsidies', desc: 'Identifying and applying for applicable state and central government grants.' },
    ],
    steps: [
      { title: 'Free Consultation', desc: 'We discuss your business challenges and growth objectives.' },
      { title: 'Requirements & Documents', desc: 'We review your current operational data and business plans.' },
      { title: 'Execution', desc: 'We formulate a strategic plan and begin process implementation or subsidy applications.' },
      { title: 'Delivery & Ongoing Support', desc: 'We monitor progress, measure KPIs, and adjust strategies as needed.' },
    ],
    idealFor: ['Startups looking for funding', 'Established companies seeking efficiency', 'Manufacturers'],
    documents: [],
    faqs: [
      { q: 'Can you help my manufacturing unit get government subsidies?', a: 'Yes, we evaluate your eligibility and assist in end-to-end processing for relevant government schemes.' },
      { q: 'How do you improve business processes?', a: 'We conduct a thorough audit of your current operations, identify inefficiencies, and implement standardized best practices.' },
    ],
  },
}
