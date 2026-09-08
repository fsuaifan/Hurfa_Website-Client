import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const translations = {
  en: {
    // --- Navigation ---
    home: 'Home',
    kitchens: 'Kitchens',
    bedrooms: 'Bedrooms',
    products: 'Products',
    aboutUs: 'About Us',
    about: 'About Us',
    account: 'Account',
    login: 'Login',
    logout: 'Logout',
    langBtn: 'العربية',

    // --- Home Page ---
    heroTitle: 'Expertly crafted, carefully selected.',
    heroSubtitle: 'Hurfa designs kitchens, bedrooms, furniture, and interiors — built to last, made to fit your space.',
    whatWeDo: 'WHAT WE DO',
    whatWeDoStatement: 'We design the rooms you live in most — kitchens, bedrooms, and the furniture in between.',
    kitchenDesign: 'KITCHEN DESIGN',
    kitchenDesc: 'Our kitchen designs harmonize with practicality and sophistication in perfect balance. Every design is a masterpiece of form and function, from contemporary minimalism to timeless classics, elevate your experiences with spaces that are designed for comfort and style.',
    furnitureDesign: 'FURNITURE DESIGN',
    furnitureDesc: 'Explore a symphony of creativity as we reimagine interiors into captivating expertise havens of comfort and aesthetics. Elevate your environment with our where design transforms mere space into unforgettable experiences.',
    interiorDesign: 'INTERIOR DESIGN',
    wallCloset: 'BEDROOMS',
    wallClosetDesc: 'Introducing our wall closet design, a harmonious blend of style and functionality that transforms your space into an organized haven. This sophisticated design seamlessly integrates into your room, offering a tailored storage solution maximizes both space and aesthetics.',

    // --- Kitchens & Kitchen Models ---
    kitchensHeroDesc: 'Every kitchen we build is designed around how you actually cook and live — from minimalist layouts to warm, traditional finishes.',
    backToKitchens: 'Back to Collections',
    backToKitchensArrow: '← Back to Collections',
    craftsmanship: 'Craftsmanship',
    modelNotFound: 'Kitchen Model Not Found',
    modelNotFoundDesc: "We couldn't find the kitchen model you were looking for.",
    loadingSpecs: 'Loading kitchen specifications...',
    contemporary: 'Contemporary',
    contemporaryDesc: 'Experience the perfect blend of style and functionality with our premium contemporary kitchen designs.',
    'Modern chic': 'Modern Chic',
    'Modern chicDesc': 'A sophisticated take on modern living, featuring clean lines and elegant finishes.',
    'Organic Modern': 'Organic Modern',
    'Organic ModernDesc': 'Bringing natural elements into the heart of your home with sustainable materials and fluid design.',

    // --- About Us ---
    aboutTitle: 'About Us',
    storyAndHeritage: 'Story & Heritage',
    aboutText: 'Hurfa is a design house and LLC established in Amman, Jordan in 2021, specializing in bedrooms, furniture, and kitchens. Guided by architectural principles, each collection is defined by proportion, material integrity, precision, longevity, and functional clarity. Our boutique on Mecca Street presents these collections within a controlled architectural environment.',
    designEndures: 'Design That Endures.',
    mission: 'Our Mission',
    missionText: 'To design and manufacture bedrooms, furniture, and kitchens through a design approach defined by proportion, material integrity, precision, and long-term relevance.',
    goal: 'Our Goal',
    goalText: 'To establish Hurfa as a design house defined by clarity and lasting relevance.',
    philosophy: 'Our Philosophy',
    philosophyText: 'Design is approached through uncompromising standards, where clarity, material integrity, precision, and enduring quality are essential — not optional.',

    // --- Process ---
    methodology: 'Methodology',
    process: 'Our Process',
    consultation: 'Consultation',
    consultationText: 'During this stage, client meetings are held to discuss the scope of the project, goals, budget, and timeline.',
    designSelection: 'Design & Material Selection',
    designText: 'Based on the client meeting outcome, the design process starts and material selection is finalized.',
    production: 'Production',
    productionText: 'Using the latest technologies in cutting & edge banding, ensuring precision and quality. Our on-site installation is carried out with professionalism.',
    qa: 'QA & Control',
    qaText: 'We prioritize your needs, exceeding expectations with standardized procedures, detailed checklists, and robust QA/QC processes.',

    // --- Org Chart ---
    orgStructure: 'Organization Structure',
    ceo: 'CEO',
    cco: 'CCO',
    marketing: 'Marketing',
    riseSolutions: 'Rise Solutions',
    sales: 'Sales',
    salesArch: 'Sales Arch',
    design: 'Design',
    seniorArch: 'Senior Interior Architect',
    it: 'IT',
    softwareEng: 'Software Engineer',
    legal: 'Legal',
    legalOffice: "Ala'a Kabneh Office",
    hr: 'HR',
    hrOfficer: 'HR Officer',
    finance: 'Finance',
    tgs: 'TGS',
    cpo: 'CPO',
    inventory: 'Inventory',
    coordinator: 'Coordinator',
    operations: 'Operations',
    opSupervisor: 'Operations Supervisor',
    prodSupervisor: 'Production Supervisor',
    prodTeam: 'Production Team',
    techDesign: 'Technical Design',
    techArch: 'Technical Interior Architect',

    // --- Our Team ---
    people: 'People',
    ourTeam: 'Our Team',
    nameZaid: 'Zaid Suaifan',
    nameRaad: 'Raad Suaifan',
    nameDana: 'Dana Suaifan',
    nameTaimaa: 'Taimaa Alshibli',
    nameAli: 'Ali Alazzawi',
    nameRami: 'Rami Almani',
    nameFahed: 'Fahed Suaifan',
    nameMohammad: 'Mohammad Alhammouri',
    nameIbrahem: 'Ibrahem Alzoubadi',
    nameBasem: 'Basem Abo-Edaq',
    nameNazeeh: 'Mohammad Nazeeh',

    roleCeo: 'CEO / Co-Founder',
    roleCpo: 'CPO / Co-Founder',
    roleCco: 'CCO',
    roleSeniorArch: 'Senior Interior Architect',
    roleTechArch: 'Technical Interior Architect',
    roleSalesArch: 'Sales Architect',
    roleHr: 'HR Officer',
    roleIt: 'IT / Software Engineer',
    roleOpSup: 'Operations Supervisor',
    roleProdSup: 'Production Supervisor',
    roleInv: 'Inventory / Data Coordinator',

    // --- Product / Bedroom UI (Static Controls & Labels) ---
    catalog: 'Catalog',
    collections: 'Collections',
    homeFurniture: 'Home Furniture',
    bedroomsHeroDesc: 'Bed frames, wardrobes, and nightstands built to match — pick a piece to see finishes, pricing, and details.',
    leadTime: 'Lead time: 14-26 days',
    freeAmman: 'Free delivery within Amman',
    customFinishes: 'Custom finishes available',
    addToCart: 'Add to Cart',
    addedToCart: '✓ Added to Cart',
    premiumCol: 'Premium collection',
    all: 'All',
    noItems: 'No items found.',
    noFurnitureFound: 'No furniture pieces found for the selected filter.',
    resetFilters: 'Reset Filters',
    loadingCollection: 'Loading Hurfa collection...',
    chooseMaterial: 'Choose Material Option:',
    europeanMaterial: 'European:',
    turkishMaterial: 'Turkish:',
    totalOriginal: 'Original Price:',
    bundlePrice: 'Bundle Price (10% OFF):',
    viewPiece: 'View Piece →',
    exclusives: 'Exclusives',
    signatureSuites: 'Signature Suites',
    signatureSuitesDesc: 'Explore our architectural whole-room conceptual collections, engineered with unified tone and materiality.',
    bespokeOffer: 'Bespoke Offer',
    specialOffer: 'Special Offer',
    configurationOption: 'Configuration Option',
    standardSuite: 'Standard Suite',
    expandedSuite: 'Expanded Suite',
    materials: 'Materials:',
    dimensions: 'Dimensions:',
    quantity: 'Quantity',

    // Sort Options
    sortFeatured: 'Featured / Default',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortNewest: 'Newest Arrivals',

    // --- Cart Page ---
    cartTitle: 'Shopping Cart',
    yourSelection: 'Your Selection',
    cartSubtitle: 'Review your chosen architectural pieces before proceeding to checkout.',
    continueShopping: 'Continue shopping',
    productCol: 'Product',
    quantityCol: 'Quantity',
    actionCol: 'Action',
    orderSummary: 'Order Summary',
    itemsSubtotal: 'Items Subtotal',
    discountLabel: 'Architectural Discount (10%)',
    deliveryLabel: 'White-Glove Delivery',
    complimentary: 'Complimentary',
    estimatedTotal: 'Estimated Total',
    promoPlaceholder: 'Promo Code (HURFA10)',
    apply: 'Apply',
    proceedToCheckout: 'Proceed to Checkout',
    placingOrder: 'Placing Order...',
    clientInfo: 'Client Information',
    clientName: 'Client Name',
    email: 'Email',
    phone: 'Phone Number',
    total: 'Total',
    warranty: "1 Year Warranty against manufacturer's defects",
    warranty5Year: '5-Year Structural Craftsmanship Warranty',
    deliveryJordan: 'White-Glove Delivery & Installation in Jordan',
    emptyCart: 'Your cart is currently empty',
    emptyCartDesc: 'Explore our curated collections of bespoke kitchens, bedrooms, and signature furniture crafted with material integrity.',
    exploreCollections: 'Explore Collections',
    clearCart: 'Clear Cart',
    remove: 'Remove',
    item: 'Item',
    items: 'Items',
    thankYouOrder: 'Thank you for your order!',
    orderRef: 'Order Reference:',
    orderScheduled: 'Your bespoke architectural order has been received and scheduled for production.',
    exploreMorePieces: 'Explore More Pieces',
    viewMyOrders: 'View My Orders',

    // --- Account & Auth ---
    clientPortal: 'Client Portal',
    myAccount: 'My Account',
    welcomeBackAccount: 'Welcome back,',
    manageAccountDesc: 'Manage your orders, inquiries, and saved pieces.',
    browseCatalog: 'Browse Catalog',
    viewCart: 'View Cart',
    logOut: 'Log Out',
    membershipStatus: 'Membership Status',
    savedCollections: 'Saved Collections',
    designInquiries: 'Design Inquiries',
    deliveryService: 'Delivery Service',
    accountDetails: 'Account Details',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    accountRole: 'Account Role',
    locationServiceArea: 'Location Service Area',
    ammanJordanComplimentary: 'Amman, Jordan (Complimentary Delivery)',
    architecturalConsultations: 'Architectural Consultations',
    myOrdersHeading: 'My Orders & Bespoke Requests',
    orderCode: 'Order Code',
    piecesDetails: 'Pieces & Details',
    orderDate: 'Date',
    orderStatus: 'Status',
    noPastOrders: 'No past orders found. Explore the Catalog to commission your first piece.',
    customerPortal: 'Customer Portal',
    studioAdmin: 'Studio Admin',
    managementConsole: 'Management Console',
    hurfaClientAccess: 'Hurfa Client Access',
    studioPortal: 'Studio Portal',
    welcomeBack: 'Welcome Back',
    adminLoginSubtitle: 'Sign in with studio credentials to manage furniture catalog, customer orders, and client inquiries.',
    customerLoginSubtitle: 'Sign in to access your bespoke orders, saved palettes, and consultation requests.',
    adminUsernameOrEmail: 'Admin Username or Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgot: 'Forgot?',
    rememberSession: 'Remember session on this device',
    signIn: 'Sign In',
    signInToStudio: 'Sign In to Studio Console',
    createAccount: 'Create Account',
    newToHurfa: 'New to Hurfa Studio?',
    alreadyHaveAccount: 'Already have an account?',
    hurfaMembership: 'Hurfa Membership',
    createAccountTitle: 'Create Your Account',
    createAccountSubtitle: 'Join Hurfa Studio to save custom palettes, request architectural consultations, and track bespoke orders.',
    agreeTermsText: 'I agree to the Hurfa Terms of Service and Privacy Policy.',

    // --- Footer ---
    contactVia: 'Contact Us Via',
    allRightsReserved: '© 2026 Hurfa LLC. All rights reserved.',
    ammanJordan: 'Amman, Jordan',
    learnMore: 'Learn More',
  },

  ar: {
    // --- Navigation ---
    home: 'الرئيسية',
    kitchens: 'المطابخ',
    bedrooms: 'غرف النوم',
    products: 'المنتجات',
    aboutUs: 'من نحن',
    about: 'من نحن',
    account: 'الحساب',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    langBtn: 'English',

    // --- Home Page ---
    heroTitle: 'صُنعت ببراعة، واختيرت بعناية.',
    heroSubtitle: 'تصمم حرفة المطابخ وغرف النوم والأثاث والديكورات الداخلية — مصممة لتدوم، ومصنوعة لتناسب مساحتك.',
    whatWeDo: 'ماذا نفعل',
    whatWeDoStatement: 'نصمم الغرف التي تعيش فيها أكثر — المطابخ وغرف النوم والأثاث بينهما.',
    kitchenDesign: 'تصميم المطابخ',
    kitchenDesc: 'تصاميم مطابخنا تتناغم مع العملية والرقي في توازن مثالي. كل تصميم هو تحفة فنية تجمع بين الشكل والوظيفة، من البساطة المعاصرة إلى الكلاسيكيات الخالدة، ارتقِ بتجاربك مع مساحات مصممة للراحة والأناقة.',
    furnitureDesign: 'تصميم الأثاث',
    furnitureDesc: 'استكشف سيمفونية من الإبداع حيث نعيد تصور المساحات الداخلية لتصبح ملاذاً للراحة والجمال. ارتقِ ببيئتك حيث يحول التصميم المساحة المجردة إلى تجارب لا تُنسى.',
    interiorDesign: 'التصميم الداخلي',
    wallCloset: 'غرف النوم',
    wallClosetDesc: 'نقدم لكم تصميم خزائن الحائط، مزيج متناغم من الأناقة والوظيفة الذي يحول مساحتك إلى ملاذ منظم. يندمج هذا التصميم المتطور بسلاسة في غرفتك، مما يوفر حلاً مخصصاً للتخزين يزيد من المساحة والجماليات.',

    // --- Kitchens & Kitchen Models ---
    kitchensHeroDesc: 'كل مطبخ نبنيه مصمم وفقاً لكيفية طهيك وعيشك فعلياً — من التصاميم البسيطة إلى التشطيبات التقليدية الدافئة.',
    backToKitchens: 'العودة إلى المجموعات',
    backToKitchensArrow: '← العودة إلى المجموعات',
    craftsmanship: 'الحرفية',
    modelNotFound: 'لم يتم العثور على نموذج المطبخ',
    modelNotFoundDesc: 'لم نتمكن من العثور على نموذج المطبخ الذي تبحث عنه.',
    loadingSpecs: 'جاري تحميل مواصفات المطبخ...',
    contemporary: 'عصري',
    contemporaryDesc: 'جرب المزيج المثالي بين الأناقة والوظيفة مع تصاميم المطابخ العصرية المميزة لدينا.',
    'Modern chic': 'مودرن شيك',
    'Modern chicDesc': 'لمسة متطورة للحياة الحديثة، تتميز بخطوط نظيفة وتشطيبات أنيقة.',
    'Organic Modern': 'أورجانيك مودرن',
    'Organic ModernDesc': 'جلب العناصر الطبيعية إلى قلب منزلك بمواد مستدامة وتصميم انسيابي.',

    // --- About Us ---
    aboutTitle: 'من نحن',
    storyAndHeritage: 'القصة والتراث',
    aboutText: 'حرفة هو دار تصميم وشركة ذات مسؤولية محدودة تأسست في عمان، الأردن في عام 2021، متخصصة في غرف النوم والأثاث والمطابخ. مسترشدين بالمبادئ المعمارية، يتم تعريف كل مجموعة من خلال التناسب، سلامة المواد، الدقة، وطول العمر، والوضوح الوظيفي. يعرض معرضنا في شارع مكة هذه المجموعات ضمن بيئة معمارية مدروسة.',
    designEndures: 'تصميم يدوم.',
    mission: 'مهمتنا',
    missionText: 'تصميم وتصنيع غرف النوم والأثاث والمطابخ من خلال نهج تصميم محدد بالتناسب، وسلامة المواد، والدقة، والأهمية على المدى الطويل.',
    goal: 'هدفنا',
    goalText: 'ترسيخ حرفة كدار تصميم يتميز بالوضوح والأهمية الدائمة.',
    philosophy: 'فلسفتنا',
    philosophyText: 'يتم التعامل مع التصميم من خلال معايير صارمة، حيث الوضوح، وسلامة المواد، والدقة، والجودة الدائمة هي أمور أساسية — وليست اختيارية.',

    // --- Process ---
    methodology: 'المنهجية',
    process: 'عمليتنا',
    consultation: 'الاستشارة',
    consultationText: 'خلال هذه المرحلة، يتم عقد اجتماعات مع العملاء لمناقشة نطاق المشروع وأهدافه والميزانية والجدول الزمني.',
    designSelection: 'التصميم واختيار المواد',
    designText: 'بناءً على نتائج اجتماع العميل، تبدأ عملية التصميم ويتم الانتهاء من اختيار المواد.',
    production: 'الإنتاج',
    productionText: 'باستخدام أحدث التقنيات في القص وتطويق الحواف، نضمن الدقة والجودة. يتم تنفيذ التركيب في الموقع باحترافية تامة.',
    qa: 'الجودة والرقابة',
    qaText: 'نحن نعطي الأولوية لاحتياجاتك، ونتجاوز التوقعات بإجراءات موحدة وقوائم تحقق مفصلة وعمليات قوية لضمان ومراقبة الجودة.',

    // --- Org Chart ---
    orgStructure: 'الهيكل التنظيمي',
    ceo: 'الرئيس التنفيذي',
    cco: 'الرئيس التجاري',
    marketing: 'التسويق',
    riseSolutions: 'رايز سوليوشنز',
    sales: 'المبيعات',
    salesArch: 'مهندس مبيعات',
    design: 'التصميم',
    seniorArch: 'مهندس تصميم داخلي أول',
    it: 'تكنولوجيا المعلومات',
    softwareEng: 'مهندس برمجيات',
    legal: 'الشؤون القانونية',
    legalOffice: 'مكتب علاء كبنة',
    hr: 'الموارد البشرية',
    hrOfficer: 'مسؤول الموارد البشرية',
    finance: 'المالية',
    tgs: 'تي جي إس',
    cpo: 'رئيس المنتجات',
    inventory: 'المخزون',
    coordinator: 'منسق',
    operations: 'العمليات',
    opSupervisor: 'مشرف العمليات',
    prodSupervisor: 'مشرف الإنتاج',
    prodTeam: 'فريق الإنتاج',
    techDesign: 'التصميم الفني',
    techArch: 'مهندس تصميم داخلي فني',

    // --- Our Team ---
    people: 'فريق العمل',
    ourTeam: 'فريقنا',
    nameZaid: 'زيد صويفان',
    nameRaad: 'رعد صويفان',
    nameDana: 'دانا صويفان',
    nameTaimaa: 'تيماء الشبلي',
    nameAli: 'علي العزاوي',
    nameRami: 'رامي الماني',
    nameFahed: 'فهد صويفان',
    nameMohammad: 'محمد الحموري',
    nameIbrahem: 'إبراهيم الزبيدي',
    nameBasem: 'باسم أبو ادق',
    nameNazeeh: 'محمد نزيه',

    roleCeo: 'الرئيس التنفيذي / شريك مؤسس',
    roleCpo: 'رئيس المنتجات / شريك مؤسس',
    roleCco: 'الرئيس التجاري',
    roleSeniorArch: 'مهندس تصميم داخلي أول',
    roleTechArch: 'مهندس تصميم داخلي فني',
    roleSalesArch: 'مهندس مبيعات',
    roleHr: 'مسؤول الموارد البشرية',
    roleIt: 'تكنولوجيا المعلومات / مهندس برمجيات',
    roleOpSup: 'مشرف العمليات',
    roleProdSup: 'مشرف الإنتاج',
    roleInv: 'منسق المخزون / البيانات',

    // --- Product / Bedroom UI (Static Controls & Labels) ---
    catalog: 'الكتالوج',
    collections: 'المجموعات',
    homeFurniture: 'أثاث منزلي',
    bedroomsHeroDesc: 'هياكل الأسرة والخزائن وطاولات السرير المصممة للتناسق — اختر قطعة لمعرفة التشطيبات والأسعار والتفاصيل.',
    leadTime: 'مدة التوريد: 14-26 يوم',
    freeAmman: 'توصيل مجاني داخل عمان',
    customFinishes: 'تشطيبات مخصصة متاحة',
    addToCart: 'أضف إلى السلة',
    addedToCart: '✓ تمت الإضافة إلى السلة',
    premiumCol: 'مجموعة متميزة',
    all: 'الكل',
    noItems: 'لم يتم العثور على عناصر.',
    noFurnitureFound: 'لم يتم العثور على قطع أثاث للتصفية المحددة.',
    resetFilters: 'إعادة ضبط التصفية',
    loadingCollection: 'جاري تحميل مجموعة حرفة...',
    chooseMaterial: 'اختر نوع المادة:',
    europeanMaterial: 'أوروبي:',
    turkishMaterial: 'تركي:',
    totalOriginal: 'السعر الأصلي:',
    bundlePrice: 'سعر المجموعة (خصم 10%):',
    viewPiece: 'عرض القطعة ←',
    exclusives: 'حصريات',
    signatureSuites: 'مجموعات مميزة',
    signatureSuitesDesc: 'استكشف مجموعاتنا المفاهيمية للغرف الكاملة، المصممة بنبرة ومواد موحدة.',
    bespokeOffer: 'عرض مخصص',
    specialOffer: 'عرض خاص',
    configurationOption: 'خيار التكوين',
    standardSuite: 'المجموعة القياسية',
    expandedSuite: 'المجموعة الموسعة',
    materials: 'المواد:',
    dimensions: 'الأبعاد:',
    quantity: 'الكمية',

    // Sort Options
    sortFeatured: 'المميز / الافتراضي',
    sortPriceLow: 'السعر: من الأقل للأعلى',
    sortPriceHigh: 'السعر: من الأعلى للأقل',
    sortNewest: 'أحدث الإضافات',

    // --- Cart Page ---
    cartTitle: 'سلة التسوق',
    yourSelection: 'اختيارك',
    cartSubtitle: 'راجع القطع المعمارية المختارة قبل إتمام الطلب.',
    continueShopping: 'متابعة التسوق',
    productCol: 'المنتج',
    quantityCol: 'الكمية',
    actionCol: 'إجراء',
    orderSummary: 'ملخص الطلب',
    itemsSubtotal: 'المجموع الفرعي',
    discountLabel: 'خصم معماري (10%)',
    deliveryLabel: 'توصيل مع التركيب',
    complimentary: 'مجاني',
    estimatedTotal: 'المجموع التقديري',
    promoPlaceholder: 'رمز الخصم (HURFA10)',
    apply: 'تطبيق',
    proceedToCheckout: 'إتمام الطلب',
    placingOrder: 'جاري تقديم الطلب...',
    clientInfo: 'معلومات العميل',
    clientName: 'اسم العميل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    total: 'المجموع',
    warranty: 'ضمان لمدة سنة ضد عيوب التصنيع',
    warranty5Year: 'ضمان لمدة 5 سنوات على الهيكل وجودة التصنيع',
    deliveryJordan: 'توصيل وتركيب شامل واحترافي في الأردن',
    emptyCart: 'سلة التسوق فارغة حالياً',
    emptyCartDesc: 'استكشف مجموعاتنا المختارة من المطابخ وغرف النوم والأثاث المميز المصنوع بدقة وسلامة المواد.',
    exploreCollections: 'استكشف المجموعات',
    clearCart: 'إفراغ السلة',
    remove: 'حذف',
    item: 'عنصر',
    items: 'عناصر',
    thankYouOrder: 'شكراً لطلبك!',
    orderRef: 'رقم الطلب:',
    orderScheduled: 'تم استلام طلبك المعماري المخصص وجدولته للإنتاج.',
    exploreMorePieces: 'استكشف المزيد من القطع',
    viewMyOrders: 'عرض طلباتي',

    // --- Account & Auth ---
    clientPortal: 'بوابة العميل',
    myAccount: 'حسابي',
    welcomeBackAccount: 'مرحباً بعودتك،',
    manageAccountDesc: 'إدارة طلباتك واستشاراتك والقطع المحفوظة.',
    browseCatalog: 'تصفح الكتالوج',
    viewCart: 'عرض السلة',
    logOut: 'تسجيل الخروج',
    membershipStatus: 'حالة العضوية',
    savedCollections: 'المجموعات المحفوظة',
    designInquiries: 'استشارات التصميم',
    deliveryService: 'خدمة التوصيل',
    accountDetails: 'تفاصيل الحساب',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    accountRole: 'نوع الحساب',
    locationServiceArea: 'منطقة الخدمة والتوصيل',
    ammanJordanComplimentary: 'عمان، الأردن (توصيل مجاني)',
    architecturalConsultations: 'الاستشارات المعمارية',
    myOrdersHeading: 'طلباتي والطلبات المخصصة',
    orderCode: 'رقم الطلب',
    piecesDetails: 'القطع والتفاصيل',
    orderDate: 'التاريخ',
    orderStatus: 'الحالة',
    noPastOrders: 'لم يتم العثور على طلبات سابقة. استكشف الكتالوج لطلب أول قطعة.',
    customerPortal: 'بوابة العميل',
    studioAdmin: 'إدارة الاستوديو',
    managementConsole: 'لوحة الإدارة',
    hurfaClientAccess: 'دخول عملاء حرفة',
    studioPortal: 'بوابة الاستوديو',
    welcomeBack: 'مرحباً بعودتك',
    adminLoginSubtitle: 'سجل الدخول باستخدام بيانات الاستوديو لإدارة كتالوج الأثاث وطلبات العملاء والاستفسارات.',
    customerLoginSubtitle: 'سجل الدخول للوصول إلى طلباتك المخصصة ولوحات الألوان المحفوظة واستشاراتك.',
    adminUsernameOrEmail: 'اسم المستخدم أو البريد الإلكتروني للمسؤول',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgot: 'نسيت؟',
    rememberSession: 'تذكر الجلسة على هذا الجهاز',
    signIn: 'تسجيل الدخول',
    signInToStudio: 'تسجيل الدخول إلى لوحة الاستوديو',
    createAccount: 'إنشاء حساب',
    newToHurfa: 'جديد في استوديو حرفة؟',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    hurfaMembership: 'عضوية حرفة',
    createAccountTitle: 'إنشاء حسابك',
    createAccountSubtitle: 'انضم إلى استوديو حرفة لحفظ لوحات الألوان المخصصة وطلب استشارات معمارية وتتبع طلباتك.',
    agreeTermsText: 'أوافق على شروط خدمة وسياسة خصوصية حرفة.',

    // --- Footer ---
    contactVia: 'اتصل بنا عبر',
    allRightsReserved: '© 2026 حرفة ذ.م.م. جميع الحقوق محفوظة.',
    ammanJordan: 'عمان، الأردن',
    learnMore: 'اعرف المزيد',
  },
};

const LanguageContext = createContext({
  language: 'en',
  isArabic: false,
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  getLocalizedName: (item) => item?.name || item?.title || '',
  getLocalizedDesc: (item) => item?.desc || item?.description || '',
  getLocalizedCategory: (cat) => cat?.name || cat || '',
  getLocalizedTagline: (item) => item?.tagline || '',
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('hurfa_lang') || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('hurfa_lang', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('hurfa_lang', next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
      localStorage.setItem('hurfa_lang', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback(
    (key, fallback = '') => {
      if (!key) return fallback || '';
      const dict = translations[language] || translations.en;
      if (dict && dict[key] !== undefined) {
        return dict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const getLocalizedName = useCallback(
    (item) => {
      if (!item) return '';
      if (typeof item === 'string') {
        const tr = t(item);
        return tr !== item ? tr : item;
      }
      if (language === 'ar' && item.arabicName) {
        return item.arabicName;
      }
      return item.name || item.title || '';
    },
    [language, t]
  );

  const getLocalizedDesc = useCallback(
    (item) => {
      if (!item) return '';
      if (typeof item === 'string') {
        const tr = t(item);
        return tr !== item ? tr : item;
      }
      if (language === 'ar' && item.arabicDesc) {
        return item.arabicDesc;
      }
      return item.desc || item.description || '';
    },
    [language, t]
  );

  const getLocalizedCategory = useCallback(
    (cat) => {
      if (!cat) return '';
      if (typeof cat === 'object') {
        return (language === 'ar' && (cat.arabic_name || cat.arabicName))
          ? (cat.arabic_name || cat.arabicName)
          : (cat.name || '');
      }
      if (typeof cat === 'string') {
        const tr = t(cat);
        return tr !== cat ? tr : cat;
      }
      return cat;
    },
    [language, t]
  );

  const getLocalizedTagline = useCallback(
    (item) => {
      if (!item) return '';
      if (typeof item === 'string') {
        const tr = t(item);
        return tr !== item ? tr : item;
      }
      if (language === 'ar' && item.arabicTagline) {
        return item.arabicTagline;
      }
      return item.tagline || '';
    },
    [language, t]
  );

  const value = {
    language,
    isArabic: language === 'ar',
    toggleLanguage,
    setLanguage,
    t,
    tName: getLocalizedName,
    tDesc: getLocalizedDesc,
    getLocalizedName,
    getLocalizedDesc,
    getLocalizedCategory,
    getLocalizedTagline,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
