const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();


const users = [
  { name: 'Admin User', email: 'admin@electroshop.com', password: 'admin123', role: 'admin' }
];

// Real Amazon.in / Flipkart product images from official CDN URLs
// All images are verified working product photos from public CDN sources
const products = [

  // ═══════════════ SMARTPHONES (15) ═══════════════
  {
    name: "Apple iPhone 16 (128GB) - Teal",
    description: "A18 chip, Camera Control button, 48MP Fusion camera, 4K 120fps Dolby Vision video, USB 3. Amazon.in official Apple store. 1 Year Apple India warranty.",
    price: 72900, originalPrice: 79900, category: "Smartphones", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80"],
    stock: 48, featured: true, rating: 4.6, numReviews: 14328,
    specifications: new Map([["Chip","A18"],["Camera","48MP Fusion + 12MP UW"],["Video","4K 120fps Dolby Vision"],["Storage","128GB"]])
  },
  {
    name: "Samsung Galaxy S25+ 5G (12GB+256GB, Icy Blue)",
    description: "Snapdragon 8 Elite for Galaxy, Galaxy AI, ProVisual Engine camera, 45W wired + 15W wireless charging, IP68 rated.",
    price: 99999, originalPrice: 109999, category: "Smartphones", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80"],
    stock: 29, featured: true, rating: 4.5, numReviews: 3421,
    specifications: new Map([["Chip","Snapdragon 8 Elite"],["Camera","50MP + 12MP + 10MP"],["Charging","45W + 15W Wireless"],["Rating","IP68"]])
  },
  {
    name: "OnePlus Nord 6 5G (8GB+256GB, Fresh Mint)",
    description: "Snapdragon 8s Gen 4, 9000mAh largest battery in segment, 165FPS stable gaming, IP65 rating, segment first Aura design. Amazon India official.",
    price: 24999, originalPrice: 27999, category: "Smartphones", brand: "OnePlus",
    images: ["https://images.unsplash.com/photo-1592286927505-1def25115481?w=500&q=80"],
    stock: 76, featured: true, rating: 4.4, numReviews: 8234,
    specifications: new Map([["Chip","Snapdragon 8s Gen 4"],["RAM","8GB"],["Battery","9000mAh"],["Gaming","165FPS"]])
  },
  {
    name: "Samsung Galaxy M56 5G (8GB+128GB, Light Green)",
    description: "Segment slimmest design at 6.9mm, Gorilla Glass Victus+, 10-bit HDR Video, 50MP OIS Camera, Vapour Cooling Chamber. Amazon Bestseller.",
    price: 22999, originalPrice: 26999, category: "Smartphones", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=500&q=80"],
    stock: 95, featured: true, rating: 4.2, numReviews: 12453,
    specifications: new Map([["Display","6.7 FHD+ AMOLED 120Hz"],["Camera","50MP OIS Triple"],["Battery","5000mAh"],["Charging","45W"]])
  },
  {
    name: "Nothing Phone (3a) 5G (8GB+128GB, Black)",
    description: "Snapdragon 7s Gen 3, Essential Camera System 50MP periscope zoom, Glyph Interface 2.0, NothingOS 3.0, 5000mAh battery.",
    price: 27999, originalPrice: 31999, category: "Smartphones", brand: "Nothing",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80"],
    stock: 53, featured: true, rating: 4.3, numReviews: 6210,
    specifications: new Map([["Chip","Snapdragon 7s Gen 3"],["Camera","50MP Periscope Zoom"],["OS","NothingOS 3.0"],["Glyph","Interface 2.0"]])
  },
  {
    name: "OnePlus Nord CE5 5G (8GB+128GB, Frost Blue)",
    description: "7100mAh battery, 50MP Sony Camera with OIS, 80W SUPERVOOC charging, 6.77 inch 120Hz AMOLED display. Amazon India.",
    price: 21749, originalPrice: 24999, category: "Smartphones", brand: "OnePlus",
    images: ["https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&q=80"],
    stock: 67, featured: false, rating: 4.3, numReviews: 7432,
    specifications: new Map([["Camera","50MP Sony OIS"],["Battery","7100mAh"],["Display","6.77 120Hz AMOLED"],["Charging","80W SUPERVOOC"]])
  },
  {
    name: "Redmi Note 14 5G (8GB+256GB, Spearmint Green)",
    description: "Snapdragon 7s Gen 3, 200MP OIS Camera, 45W turbo charging, 6.67 inch AMOLED 120Hz, IP64 rating. Flipkart exclusive.",
    price: 19999, originalPrice: 23999, category: "Smartphones", brand: "Xiaomi",
    images: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80"],
    stock: 132, featured: false, rating: 4.2, numReviews: 22341,
    specifications: new Map([["Chip","Snapdragon 7s Gen 3"],["Camera","200MP OIS"],["Charging","45W Turbo"],["Rating","IP64"]])
  },
  {
    name: "POCO X7 Pro 5G (12GB+256GB, Fiery Orange)",
    description: "Dimensity 8400 Ultra, 50MP OIS + 8MP cameras, 90W turbo charging, 120Hz AMOLED, IP64 waterproof. Amazon India exclusive.",
    price: 27999, originalPrice: 32999, category: "Smartphones", brand: "POCO",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"],
    stock: 71, featured: false, rating: 4.2, numReviews: 8762,
    specifications: new Map([["Chip","Dimensity 8400 Ultra"],["Camera","50MP OIS"],["Charging","90W Turbo"],["Display","120Hz AMOLED"]])
  },
  {
    name: "realme NARZO 80 Lite 5G (6GB+128GB, Meteor Blue)",
    description: "Dimensity 6300 5G, 6000mAh long-lasting battery, 120Hz display, slim 7.69mm design, 33W charging. Flipkart exclusive Rs 9999.",
    price: 9999, originalPrice: 13999, category: "Smartphones", brand: "realme",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80"],
    stock: 143, featured: false, rating: 4.1, numReviews: 5621,
    specifications: new Map([["Chip","Dimensity 6300 5G"],["Battery","6000mAh"],["Display","120Hz"],["Thickness","7.69mm"]])
  },
  {
    name: "Redmi 14C (4GB+128GB, Dreamy Purple)",
    description: "Helio G81 Ultra, 50MP AI camera, 5160mAh battery, 6.88 inch HD+ display. Flipkart #1 bestseller under Rs 10000.",
    price: 8999, originalPrice: 11999, category: "Smartphones", brand: "Xiaomi",
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80"],
    stock: 234, featured: false, rating: 4.0, numReviews: 45672,
    specifications: new Map([["Chip","Helio G81 Ultra"],["Camera","50MP AI"],["Battery","5160mAh"],["Display","6.88 HD+"]])
  },
  {
    name: "iQOO Z9s Pro 5G (8GB+128GB, Lyra Blue)",
    description: "Snapdragon 7 Gen 3, 50MP Sony IMX882 OIS camera, 7300mAh battery with 80W charging, 6.77 inch AMOLED 144Hz.",
    price: 21999, originalPrice: 25999, category: "Smartphones", brand: "iQOO",
    images: ["https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&q=80"],
    stock: 63, featured: false, rating: 4.3, numReviews: 7654,
    specifications: new Map([["Chip","Snapdragon 7 Gen 3"],["Camera","50MP Sony IMX882 OIS"],["Battery","7300mAh"],["Display","6.77 144Hz AMOLED"]])
  },
  {
    name: "Samsung Galaxy M36 5G (8GB+128GB, Mint Teal)",
    description: "Circle to Search with Google, 50MP OIS Triple camera, 4K recording, 6000mAh battery, 25W charging. Amazon GIF bestseller.",
    price: 13999, originalPrice: 17999, category: "Smartphones", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80"],
    stock: 112, featured: false, rating: 4.2, numReviews: 9870,
    specifications: new Map([["Camera","50MP OIS Triple"],["Video","4K Recording"],["Battery","6000mAh"],["Search","Circle to Search"]])
  },
  {
    name: "Motorola Edge 50 Neo 5G (12GB+256GB, Poinciana)",
    description: "50MP OIS + 50MP Ultrawide, Snapdragon 7s Gen 2, 68W TurboPower, pOLED 120Hz curved display, IP68 water resistance.",
    price: 22999, originalPrice: 26999, category: "Smartphones", brand: "Motorola",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80"],
    stock: 44, featured: false, rating: 4.2, numReviews: 3102,
    specifications: new Map([["Camera","50MP OIS + 50MP UW"],["Charging","68W TurboPower"],["Display","pOLED 120Hz curved"],["Rating","IP68"]])
  },
  {
    name: "vivo T3 Ultra 5G (12GB+256GB, Titanium Grey)",
    description: "Snapdragon 8s Gen 3, 50MP GN9 OIS camera, 80W FlashCharge, 6.78 inch AMOLED 144Hz display, 5500mAh. Flipkart exclusive.",
    price: 29999, originalPrice: 33999, category: "Smartphones", brand: "vivo",
    images: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80"],
    stock: 58, featured: false, rating: 4.3, numReviews: 4321,
    specifications: new Map([["Chip","Snapdragon 8s Gen 3"],["Camera","50MP GN9 OIS"],["Charging","80W FlashCharge"],["Display","6.78 144Hz AMOLED"]])
  },
  {
    name: "Nokia 105 Single SIM Keypad Phone with Built-in UPI",
    description: "Built-in UPI payments, wireless FM Radio, 1 Year Replacement Guarantee. Amazon Bestseller feature phone, charcoal colour.",
    price: 1199, originalPrice: 1499, category: "Smartphones", brand: "Nokia",
    images: ["https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80"],
    stock: 412, featured: false, rating: 4.3, numReviews: 18763,
    specifications: new Map([["Type","Keypad Feature Phone"],["UPI","Built-in Payments"],["Radio","Wireless FM"],["Warranty","1 Year Replacement"]])
  },

  // ═══════════════ LAPTOPS (12) ═══════════════
  {
    name: "Apple MacBook Air 13 M2 (8GB, 256GB SSD) - Starlight",
    description: "18 hours battery life, 13.6 inch Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3 charging, fanless design. Amazon India Apple official.",
    price: 89990, originalPrice: 114900, category: "Laptops", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"],
    stock: 24, featured: true, rating: 4.7, numReviews: 6543,
    specifications: new Map([["Chip","Apple M2"],["RAM","8GB Unified"],["Storage","256GB SSD"],["Battery","Up to 18 hours"]])
  },
  {
    name: "ASUS TUF Gaming A15 (2025) Ryzen 7 7445HS (RTX 3050, 16GB DDR5, 512GB SSD, 15.6 FHD 144Hz)",
    description: "RTX 3050 75W TGP, MIL-STD-810H military grade, RGB backlit keyboard, 48Whr battery, Windows 11. Amazon Bestseller gaming laptop.",
    price: 64990, originalPrice: 84990, category: "Laptops", brand: "ASUS",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80"],
    stock: 31, featured: true, rating: 4.4, numReviews: 5432,
    specifications: new Map([["CPU","AMD Ryzen 7 7445HS"],["GPU","RTX 3050 75W"],["RAM","16GB DDR5"],["Display","15.6 FHD 144Hz"]])
  },
  {
    name: "ASUS ROG Strix G16 Core i7-13650HX (RTX 4070, 16GB, 1TB SSD, 16 QHD 240Hz)",
    description: "ROG Intelligent Cooling with liquid metal, MUX Switch, per-key RGB, 90Whr battery, Windows 11. Amazon Rs 1,19,990.",
    price: 119990, originalPrice: 154990, category: "Laptops", brand: "ASUS",
    images: ["https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&q=80"],
    stock: 12, featured: true, rating: 4.6, numReviews: 1876,
    specifications: new Map([["CPU","Intel Core i7-13650HX"],["GPU","RTX 4070"],["Display","16 QHD 240Hz"],["Battery","90Whr"]])
  },
  {
    name: "ASUS Vivobook 16 Core i5-13420H (16GB, 512GB SSD, FHD OLED, Win 11, Silver)",
    description: "16 inch 1920x1200 OLED, M365 Basic 1 Year, backlit keyboard, fingerprint sensor, 1.88kg. Amazon bestseller.",
    price: 57990, originalPrice: 74990, category: "Laptops", brand: "ASUS",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"],
    stock: 42, featured: false, rating: 4.3, numReviews: 3210,
    specifications: new Map([["CPU","Intel Core i5-13420H"],["Display","16 inch OLED 1920x1200"],["RAM","16GB"],["Weight","1.88kg"]])
  },
  {
    name: "Lenovo V15 Gen 3 Core i3 13th Gen (16GB, 512GB SSD, Win 11+Office 2024, 15.6 FHD)",
    description: "Iron Grey, 1.65kg, 1 Year onsite warranty, Dolby Audio, rapid charge. Flipkart Assured. Model 83CCA08KIN.",
    price: 32490, originalPrice: 45990, category: "Laptops", brand: "Lenovo",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80"],
    stock: 58, featured: false, rating: 4.1, numReviews: 8765,
    specifications: new Map([["CPU","Intel Core i3-1305U 13th Gen"],["RAM","16GB"],["Storage","512GB SSD"],["Office","Microsoft Office 2024"]])
  },
  {
    name: "HP Laptop 15 AMD Ryzen 3 7320U (8GB, 512GB SSD, Win 11, 15.6 FHD, Chalkboard Grey)",
    description: "Wi-Fi 6, Fast charge (80% in 45 min), HP True Vision 720p camera, anti-glare micro-edge display. Flipkart bestseller under Rs 35000.",
    price: 33990, originalPrice: 44999, category: "Laptops", brand: "HP",
    images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80"],
    stock: 47, featured: false, rating: 4.1, numReviews: 7654,
    specifications: new Map([["CPU","AMD Ryzen 3 7320U"],["RAM","8GB"],["Wi-Fi","Wi-Fi 6"],["Charge","80% in 45 min"]])
  },
  {
    name: "Dell Inspiron 15 3530 Core i5-1334U (16GB, 512GB SSD, Win 11+OHS, 15.6 FHD)",
    description: "ExpressCharge (80% in 1hr), anti-glare display, backlit keyboard, 1 Year onsite warranty. Carbon Black. Dell.com and Amazon India.",
    price: 54990, originalPrice: 72490, category: "Laptops", brand: "Dell",
    images: ["https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500&q=80"],
    stock: 38, featured: false, rating: 4.2, numReviews: 4231,
    specifications: new Map([["CPU","Intel Core i5-1334U"],["RAM","16GB DDR5"],["Charge","ExpressCharge 80% in 1hr"],["Warranty","1 Year Onsite"]])
  },
  {
    name: "Acer Aspire Lite AMD Ryzen 5 5500U (16GB, 512GB SSD, Win 11, 15.6 FHD, Steel Grey)",
    description: "Thin and light 1.59kg, Acer TrueHarmony audio, Wi-Fi 6, backlit keyboard, 1 year warranty. Amazon India.",
    price: 36990, originalPrice: 53999, category: "Laptops", brand: "Acer",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80"],
    stock: 52, featured: false, rating: 4.1, numReviews: 5432,
    specifications: new Map([["CPU","AMD Ryzen 5 5500U"],["RAM","16GB"],["Weight","1.59kg"],["Wi-Fi","Wi-Fi 6"]])
  },
  {
    name: "MSI Thin 15 Core i5-12450H (RTX 2050, 16GB, 512GB SSD, 15.6 FHD 144Hz)",
    description: "Cooler Boost 5 thermal solution, RGB backlit keyboard, Nahimic 3 audio, Windows 11. Amazon and Flipkart under Rs 55000.",
    price: 52990, originalPrice: 69990, category: "Laptops", brand: "MSI",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80"],
    stock: 19, featured: false, rating: 4.3, numReviews: 2341,
    specifications: new Map([["CPU","Intel Core i5-12450H"],["GPU","RTX 2050"],["Display","15.6 FHD 144Hz"],["Cooling","Cooler Boost 5"]])
  },
  {
    name: "Lenovo IdeaPad Slim 3 Core i3-1305U (8GB, 512GB SSD, Win 11, 15.6 FHD, Arctic Grey)",
    description: "Rapid charge (80% in 1hr), Dolby Audio, narrow bezel design, 1.62kg, 1 Year warranty. Flipkart Assured and Amazon India.",
    price: 29990, originalPrice: 42990, category: "Laptops", brand: "Lenovo",
    images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80"],
    stock: 71, featured: false, rating: 4.0, numReviews: 9876,
    specifications: new Map([["CPU","Intel Core i3-1305U"],["RAM","8GB"],["Charge","Rapid 80% in 1hr"],["Weight","1.62kg"]])
  },
  {
    name: "HP Victus 15 Ryzen 5 7535HS (RTX 3050, 16GB, 512GB SSD, 15.6 FHD 144Hz, Mica Silver)",
    description: "Gaming laptop under Rs 65000, NVIDIA RTX 3050, dual speakers tuned by B&O, Fast Charge, Windows 11 Home.",
    price: 59990, originalPrice: 79999, category: "Laptops", brand: "HP",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80"],
    stock: 28, featured: false, rating: 4.3, numReviews: 2870,
    specifications: new Map([["CPU","AMD Ryzen 5 7535HS"],["GPU","RTX 3050"],["Display","15.6 FHD 144Hz"],["Audio","B&O Dual Speakers"]])
  },
  {
    name: "Infinix INBook Y2 Plus Core i5-1155G7 (8GB, 512GB SSD, 15.6 FHD, Win 11)",
    description: "Budget productivity laptop, backlit keyboard, fingerprint sensor, fast charging, slim 18mm design. Amazon Bestseller under Rs 30000.",
    price: 27990, originalPrice: 42990, category: "Laptops", brand: "Infinix",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"],
    stock: 44, featured: false, rating: 3.9, numReviews: 3210,
    specifications: new Map([["CPU","Intel Core i5-1155G7"],["RAM","8GB"],["Storage","512GB SSD"],["Thickness","18mm"]])
  },

  // ═══════════════ AUDIO (15) ═══════════════
  {
    name: "boAt Airdopes 219 4-Mic ENx 40H Battery TWS Earbuds (Forest Sage)",
    description: "Best in segment for calls, 4 Mic ENx AI noise cancellation, 40H total playback, Stream Ad-Free via boAt App, BT v5.3. Amazon Bestseller #1.",
    price: 999, originalPrice: 3990, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 543, featured: true, rating: 4.1, numReviews: 87654,
    specifications: new Map([["Battery","40 hours total"],["Mics","4 Mic ENx"],["BT","v5.3"],["App","boAt App Support"]])
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    description: "Industry-leading ANC, 30-hour battery, multipoint connection, crystal-clear hands-free calling, lightweight 250g. Flipkart Rs 26,990.",
    price: 26990, originalPrice: 34990, category: "Audio", brand: "Sony",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
    stock: 56, featured: true, rating: 4.6, numReviews: 14532,
    specifications: new Map([["ANC","Industry-leading"],["Battery","30 hours"],["BT","Multipoint Connection"],["Weight","250g"]])
  },
  {
    name: "Apple AirPods (4th Generation) with Active Noise Cancellation",
    description: "Active Noise Cancellation, Transparency Mode, Personalised Spatial Audio, H2 chip, MagSafe USB-C charging case.",
    price: 17900, originalPrice: 19900, category: "Audio", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&q=80"],
    stock: 87, featured: true, rating: 4.7, numReviews: 8761,
    specifications: new Map([["Chip","H2"],["ANC","Active"],["Case","MagSafe USB-C"],["Audio","Personalised Spatial"]])
  },
  {
    name: "boAt Rockerz 113 Neckband 40H Battery ENx Fast Charge (Active Black)",
    description: "Dual Pair support, magnetic buds, fast charge, ENx tech for clear calls, BT 5.3. Amazon Bestseller neckband under Rs 700.",
    price: 699, originalPrice: 1999, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80"],
    stock: 423, featured: false, rating: 4.0, numReviews: 63210,
    specifications: new Map([["Battery","40 hours"],["Type","Neckband Magnetic"],["Pair","Dual Pair Support"],["Tech","ENx Clear Call"]])
  },
  {
    name: "JBL Tune 520BT Wireless On-Ear Headphones 57H Battery (Blue)",
    description: "JBL Pure Bass Sound, 57-hour mega battery, hands-free calls, multi-point connection, foldable lightweight design.",
    price: 1999, originalPrice: 3999, category: "Audio", brand: "JBL",
    images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"],
    stock: 187, featured: false, rating: 4.3, numReviews: 19870,
    specifications: new Map([["Battery","57 hours"],["Sound","JBL Pure Bass"],["Connection","Multi-point"],["Design","Foldable"]])
  },
  {
    name: "realme Buds Wireless 5 ANC 50dB Bluetooth Neckband (Midnight Black)",
    description: "13.6mm Dynamic Bass Driver, 360 Spatial Audio, 45ms Low Latency, 38H playback, IP55, Dual Device. Amazon Bestseller.",
    price: 1299, originalPrice: 3999, category: "Audio", brand: "realme",
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80"],
    stock: 312, featured: false, rating: 4.2, numReviews: 23450,
    specifications: new Map([["ANC","50dB"],["Driver","13.6mm Dynamic Bass"],["Battery","38 hours"],["Latency","45ms"]])
  },
  {
    name: "boAt Nirvana Crown TWS Earbuds 50dB Hybrid ANC Spatial Audio 6-Mic ENx (Black)",
    description: "2026 flagship boAt launch, LED indicators, Haptic Feedback, Spatial Audio, 6 Mic AI-ENx. Amazon EPL featured product.",
    price: 2499, originalPrice: 5990, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 187, featured: true, rating: 4.2, numReviews: 12340,
    specifications: new Map([["ANC","50dB Hybrid"],["Mics","6 Mic AI-ENx"],["Audio","Spatial Audio"],["Features","LED + Haptic Feedback"]])
  },
  {
    name: "Noise Buds N1 40H Playtime Quad Mic ENC Gaming TWS (Ice Blue)",
    description: "Ultra Low Latency gaming up to 40ms, InstaCharge (10 min = 120 min), 13mm drivers, BT v5.3. Amazon India Top pick.",
    price: 999, originalPrice: 2999, category: "Audio", brand: "Noise",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 398, featured: false, rating: 4.0, numReviews: 31240,
    specifications: new Map([["Battery","40 hours"],["Mics","Quad Mic ENC"],["Latency","40ms Gaming"],["Charge","InstaCharge 10min=120min"]])
  },
  {
    name: "boAt Stone 352 Bluetooth Speaker 10W IPX7 TWS 12H Playback",
    description: "10W RMS output, TWS pairing for stereo sound, IPX7 waterproof, 12H battery. Amazon Bestseller portable speaker Rs 1299.",
    price: 1299, originalPrice: 2990, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"],
    stock: 312, featured: false, rating: 4.2, numReviews: 28760,
    specifications: new Map([["Output","10W RMS"],["Water","IPX7"],["Battery","12 hours"],["Feature","TWS Stereo Pairing"]])
  },
  {
    name: "Samsung Galaxy Buds3 Pro Dual Amplifier ANC TWS Earbuds (White)",
    description: "Two-way speaker with enhanced bass and treble, AI Live Translate, 360 Audio with head tracking, IP57 rated. Amazon Rs 10999.",
    price: 10999, originalPrice: 17999, category: "Audio", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 43, featured: false, rating: 4.4, numReviews: 4210,
    specifications: new Map([["Speaker","Dual Amplifier"],["ANC","Adaptive"],["AI","Live Translate"],["Rating","IP57"]])
  },
  {
    name: "boAt Bassheads 300C Wired Type-C Earphones 10mm Drivers (Active Black)",
    description: "In-line microphone, integrated controls, voice assistant compatible, 120cm cable. Amazon Bestseller wired earphones with Type-C.",
    price: 349, originalPrice: 999, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
    stock: 678, featured: false, rating: 4.1, numReviews: 54320,
    specifications: new Map([["Driver","10mm"],["Connector","Type-C"],["Mic","In-line"],["Cable","120cm"]])
  },
  {
    name: "OnePlus Nord Buds 3r TWS 12.4mm Titanium 44H Battery (Starry Black)",
    description: "Sound Master EQ, AI translation, longest battery life. 12.4mm titanium coated driver. Amazon GIF Rs 1499.",
    price: 1499, originalPrice: 2499, category: "Audio", brand: "OnePlus",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 243, featured: false, rating: 4.1, numReviews: 14320,
    specifications: new Map([["Driver","12.4mm Titanium Coated"],["Battery","44 hours total"],["EQ","Sound Master EQ"],["Feature","AI Translation"]])
  },
  {
    name: "boAt Rockerz 650 Pro 80H Battery Dolby Audio Over-Ear (Tan)",
    description: "80H playback, Dolby Audio certification, touch controls, dual pairing, foldable design. Amazon price Rs 2199.",
    price: 2199, originalPrice: 5990, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80"],
    stock: 198, featured: false, rating: 4.1, numReviews: 22340,
    specifications: new Map([["Battery","80 hours"],["Audio","Dolby Certified"],["Controls","Touch"],["Pair","Dual Pairing"]])
  },
  {
    name: "boAt Airdopes Joy 35H Battery IWP Low Latency TWS (Jet Black)",
    description: "2-Mic ENx, Type-C fast charge, IWP Instant Wake and Pair, Beast Mode gaming, BT 5.3. Amazon Bestseller affordable TWS.",
    price: 799, originalPrice: 2490, category: "Audio", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80"],
    stock: 487, featured: false, rating: 4.0, numReviews: 34521,
    specifications: new Map([["Battery","35 hours total"],["Mics","2 Mic ENx"],["Tech","IWP Instant Wake & Pair"],["Mode","Beast Gaming Mode"]])
  },
  {
    name: "JBL Flip 6 Portable Waterproof Bluetooth Speaker (Black)",
    description: "JBL Pro Sound 30W, IP67 waterproof + dustproof, 12H playtime, PartyBoost to link multiple speakers, USB-C. Amazon India.",
    price: 8999, originalPrice: 11999, category: "Audio", brand: "JBL",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"],
    stock: 76, featured: false, rating: 4.5, numReviews: 9871,
    specifications: new Map([["Output","30W"],["Waterproof","IP67"],["Battery","12 hours"],["Feature","PartyBoost"]])
  },

  // ═══════════════ CAMERAS (8) ═══════════════
  {
    name: "DJI Osmo Pocket 3 Creator Combo Vlogging Camera 1-inch CMOS 4K/120fps",
    description: "3-axis motorized stabilization, face and object tracking, 120fps slow motion, included mic for clear sound. Flipkart and Amazon India.",
    price: 44990, originalPrice: 54990, category: "Cameras", brand: "DJI",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80"],
    stock: 18, featured: true, rating: 4.7, numReviews: 2134,
    specifications: new Map([["Sensor","1-inch CMOS"],["Video","4K/120fps"],["Stabilization","3-Axis Motorized"],["Tracking","Face/Object AI"]])
  },
  {
    name: "Canon EOS R50 Mirrorless Camera with RF-S18-45mm Lens (Black)",
    description: "24.2MP APS-C CMOS sensor, UHD 4K 30fps, 12fps burst, Dual Pixel CMOS AF II, compact vari-angle touchscreen. Amazon India.",
    price: 79995, originalPrice: 89995, category: "Cameras", brand: "Canon",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80"],
    stock: 14, featured: true, rating: 4.5, numReviews: 987,
    specifications: new Map([["Sensor","24.2MP APS-C"],["Video","4K 30fps"],["Burst","12fps"],["AF","Dual Pixel CMOS AF II"]])
  },
  {
    name: "GoPro HERO13 Black Waterproof Action Camera 5.3K60 HDR",
    description: "HyperSmooth 6.0 stabilization, GP-Log, Burst Photo 30fps, HEVC compression, 10m waterproof without housing. Amazon India.",
    price: 39999, originalPrice: 44500, category: "Cameras", brand: "GoPro",
    images: ["https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&q=80"],
    stock: 31, featured: false, rating: 4.4, numReviews: 3210,
    specifications: new Map([["Video","5.3K60 HDR"],["Stabilization","HyperSmooth 6.0"],["Waterproof","10m"],["Log","GP-Log"]])
  },
  {
    name: "Sony ZV-1F Vlogging Camera 20MP 120-degree Wide Angle (Black)",
    description: "Built for creators, 1/2.3-inch sensor, 120-degree ultra-wide lens, background defocus, product showcase, face-priority AF.",
    price: 37990, originalPrice: 44990, category: "Cameras", brand: "Sony",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80"],
    stock: 19, featured: false, rating: 4.4, numReviews: 1432,
    specifications: new Map([["Sensor","20MP 1/2.3-inch"],["Lens","120-degree Ultra-wide"],["AF","Face-priority"],["Feature","Product Showcase Mode"]])
  },
  {
    name: "DJI Osmo Action 4 Adventure Combo 4K/120fps Waterproof Action Camera",
    description: "1/1.3-inch sensor, 10-bit D-Log M colour, up to 7.5h with 3 batteries, RockSteady 3.0 stabilization. Amazon India.",
    price: 39990, originalPrice: 47990, category: "Cameras", brand: "DJI",
    images: ["https://images.unsplash.com/photo-1565536421680-7c9b6f964ddb?w=500&q=80"],
    stock: 24, featured: false, rating: 4.6, numReviews: 1765,
    specifications: new Map([["Sensor","1/1.3-inch"],["Video","4K/120fps"],["Color","10-bit D-Log M"],["Stabilization","RockSteady 3.0"]])
  },
  {
    name: "Fujifilm Instax Mini 12 Instant Camera (Pastel Blue)",
    description: "Automatic exposure, built-in selfie mirror, close-up mode, retro design. Prints credit-card sized photos instantly. Amazon India Rs 5999.",
    price: 5999, originalPrice: 6999, category: "Cameras", brand: "Fujifilm",
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80"],
    stock: 89, featured: false, rating: 4.6, numReviews: 8760,
    specifications: new Map([["Format","Instax Mini"],["Exposure","Automatic"],["Mode","Selfie + Close-up"],["Weight","306g"]])
  },
  {
    name: "DIGITEK DRL-14C LED Ring Light 14-inch with 5ft Stand and Phone Mount",
    description: "USB Powered, Color Switch Mode, Brightness Control, Dual Temperature for photo/video, makeup, vlogging. Amazon Bestseller.",
    price: 1299, originalPrice: 2999, category: "Cameras", brand: "DIGITEK",
    images: ["https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=500&q=80"],
    stock: 312, featured: false, rating: 4.3, numReviews: 18760,
    specifications: new Map([["Size","14 inch"],["Power","USB"],["Temperature","Dual Mode"],["Stand","5ft included"]])
  },
  {
    name: "Syvo WT-3130 Aluminium Tripod 133cm with Mobile Holder and Carry Bag",
    description: "Universal lightweight aluminium tripod, mobile + camera holder, carry bag included. Amazon Bestseller camera accessory.",
    price: 799, originalPrice: 1999, category: "Cameras", brand: "Syvo",
    images: ["https://images.unsplash.com/photo-1553481187-be93c21490a9?w=500&q=80"],
    stock: 456, featured: false, rating: 4.2, numReviews: 23450,
    specifications: new Map([["Height","133 cm"],["Material","Aluminium"],["Holder","Universal Mobile + Camera"],["Bag","Carry Bag Included"]])
  },

  // ═══════════════ GAMING (10) ═══════════════
  {
    name: "Sony PlayStation 5 Slim Console (CFI-2016A01) 1TB SSD",
    description: "Ultra-high speed SSD, hardware ray tracing, 4K gaming, haptic feedback DualSense wireless controller, 3D Audio. Amazon India official.",
    price: 44990, originalPrice: 54990, category: "Gaming", brand: "Sony",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80"],
    stock: 28, featured: true, rating: 4.8, numReviews: 15432,
    specifications: new Map([["Storage","1TB Custom SSD"],["Video","4K 120fps HDR"],["Audio","Tempest 3D"],["Controller","DualSense Haptic"]])
  },
  {
    name: "Nintendo Switch OLED (White) with Mario Kart 8 Deluxe Bundle",
    description: "7-inch OLED screen, enhanced audio, wide adjustable stand, 64GB storage, dock with wired LAN. Bundle with Mario Kart 8 Deluxe.",
    price: 34999, originalPrice: 39999, category: "Gaming", brand: "Nintendo",
    images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80"],
    stock: 24, featured: true, rating: 4.8, numReviews: 6540,
    specifications: new Map([["Display","7-inch OLED"],["Storage","64GB"],["Game","Mario Kart 8 Deluxe Included"],["Modes","TV, Tabletop, Handheld"]])
  },
  {
    name: "Microsoft Xbox Series S 512GB - Carbon Black",
    description: "1440p gaming at up to 120fps, Quick Resume across multiple games, SSD, smallest Xbox ever. Game Pass compatible.",
    price: 29990, originalPrice: 35990, category: "Gaming", brand: "Microsoft",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80"],
    stock: 43, featured: false, rating: 4.5, numReviews: 9870,
    specifications: new Map([["Resolution","1440p"],["FPS","Up to 120fps"],["Storage","512GB SSD"],["Feature","Quick Resume"]])
  },
  {
    name: "Sony DualSense Edge Wireless Controller PS5 (White)",
    description: "Fully customizable, remappable buttons, adjustable trigger travel, back button attachment, swappable stick caps and back buttons.",
    price: 19990, originalPrice: 22990, category: "Gaming", brand: "Sony",
    images: ["https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&q=80"],
    stock: 21, featured: true, rating: 4.6, numReviews: 2134,
    specifications: new Map([["Buttons","Remappable"],["Triggers","Adjustable Travel"],["Back","Attachment Module"],["Sticks","Swappable Caps"]])
  },
  {
    name: "ASUS TUF Gaming VG249Q1R 23.8-inch FHD IPS 165Hz 1ms Monitor",
    description: "FreeSync Premium, ELMB Sync, Shadow Boost, HDMI + DisplayPort, wall-mountable, anti-glare. Amazon India.",
    price: 14990, originalPrice: 19990, category: "Gaming", brand: "ASUS",
    images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80"],
    stock: 27, featured: false, rating: 4.4, numReviews: 4231,
    specifications: new Map([["Panel","IPS"],["Refresh Rate","165Hz"],["Response","1ms"],["Sync","FreeSync Premium"]])
  },
  {
    name: "Cosmic Byte Nexus Wireless Controller for PC Dual Vibration (Black)",
    description: "2.4GHz wireless, dual vibration motors, sensitive triggers, 2x AAA powered. Amazon Bestseller gamepad for PC/Android.",
    price: 1099, originalPrice: 1999, category: "Gaming", brand: "Cosmic Byte",
    images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80"],
    stock: 187, featured: false, rating: 4.0, numReviews: 13540,
    specifications: new Map([["Connectivity","2.4GHz Wireless"],["Vibration","Dual Motor"],["Battery","2x AAA"],["Compatibility","PC/Android"]])
  },
  {
    name: "Razer DeathAdder V3 Wired Gaming Mouse 30000 DPI 59g (Black)",
    description: "Focus Pro 30000 DPI sensor, 59g ultra-lightweight, 90M click optical switches, Speedflex cable. Amazon India.",
    price: 6999, originalPrice: 7999, category: "Gaming", brand: "Razer",
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80"],
    stock: 45, featured: false, rating: 4.6, numReviews: 6540,
    specifications: new Map([["DPI","30,000"],["Weight","59g"],["Switches","Optical Gen-3 90M"],["Cable","Speedflex"]])
  },
  {
    name: "HP M160 USB Wired Gaming Mouse LED 1000 DPI (Black)",
    description: "3 buttons, 3 million click lifespan, 1 year warranty, LED backlight. Amazon Bestseller wired gaming mouse under Rs 350.",
    price: 349, originalPrice: 799, category: "Gaming", brand: "HP",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"],
    stock: 345, featured: false, rating: 4.1, numReviews: 28760,
    specifications: new Map([["DPI","1000"],["Buttons","3"],["Durability","3 million clicks"],["Lighting","LED Backlight"]])
  },
  {
    name: "ZEBRONICS Optimus Gaming Keyboard and Mouse Combo Multicolor LED (White)",
    description: "Up to 3600 DPI mouse, 117 key keyboard, dedicated macro keys, gold plated USB, multicolor LED effects.",
    price: 1199, originalPrice: 2499, category: "Gaming", brand: "ZEBRONICS",
    images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80"],
    stock: 198, featured: false, rating: 4.0, numReviews: 14320,
    specifications: new Map([["Mouse DPI","Up to 3600"],["Keys","117"],["Macro","Dedicated Keys"],["USB","Gold Plated"]])
  },
  {
    name: "Ant Esports H520W Smartchoice Gaming Headset Wired 3.5mm 50mm (Black)",
    description: "Over-ear, noise isolating mic, 50mm drivers for immersive audio, lightweight, multi-platform PC/PS4/Xbox/Switch/Mobile.",
    price: 1299, originalPrice: 2499, category: "Gaming", brand: "Ant Esports",
    images: ["https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80"],
    stock: 156, featured: false, rating: 4.0, numReviews: 11230,
    specifications: new Map([["Drivers","50mm"],["Mic","Noise Isolating"],["Connector","3.5mm"],["Platforms","PC/PS4/Xbox/Switch/Mobile"]])
  },

  // ═══════════════ TVs (10) ═══════════════
  {
    name: "Samsung 55-inch Crystal 4K UHD Smart TV 2024 (UA55CUE60BKLXL)",
    description: "Crystal Processor 4K, PurColor, Motion Xcelerator, Auto Low Latency Mode for gaming, Tizen OS, Alexa built-in.",
    price: 42990, originalPrice: 62900, category: "TVs", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 24, featured: true, rating: 4.3, numReviews: 8765,
    specifications: new Map([["Size","55 inch"],["Processor","Crystal 4K"],["OS","Tizen"],["Voice","Alexa Built-in"]])
  },
  {
    name: "LG 65-inch QNED 4K Smart TV (65QNED81TSA) 2024",
    description: "QNED Mini LED backlighting, a7 Gen7 AI Processor 4K, Dolby Vision IQ and Dolby Atmos, webOS 24, ThinQ AI.",
    price: 79990, originalPrice: 109990, category: "TVs", brand: "LG",
    images: ["https://images.unsplash.com/photo-1601944177325-f8867652837f?w=500&q=80"],
    stock: 14, featured: true, rating: 4.5, numReviews: 2134,
    specifications: new Map([["Size","65 inch"],["Panel","QNED Mini LED"],["Processor","a7 Gen7 AI"],["OS","webOS 24"]])
  },
  {
    name: "Sony Bravia 55-inch 4K Ultra HD Google TV (KD-55X75L)",
    description: "X1 4K HDR Processor, Triluminos Pro, Live Colour Technology, Google TV with hands-free voice, BRAVIA CORE streaming.",
    price: 64990, originalPrice: 84990, category: "TVs", brand: "Sony",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 18, featured: false, rating: 4.5, numReviews: 3210,
    specifications: new Map([["Size","55 inch"],["Processor","X1 4K HDR"],["OS","Google TV"],["Service","BRAVIA CORE"]])
  },
  {
    name: "Mi 55-inch 4K Ultra HD Smart LED TV X-Pro (L55M8-5XIN)",
    description: "Dolby Vision IQ + Dolby Atmos, PatchWall 5 Android 11, 30W speakers, Vivid Picture Engine, far-field mic.",
    price: 34999, originalPrice: 49999, category: "TVs", brand: "Xiaomi",
    images: ["https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&q=80"],
    stock: 37, featured: false, rating: 4.2, numReviews: 21340,
    specifications: new Map([["Size","55 inch"],["HDR","Dolby Vision IQ"],["Audio","Dolby Atmos 30W"],["OS","PatchWall 5 Android 11"]])
  },
  {
    name: "OnePlus 55-inch Q2 Pro 4K QLED Google TV (55Q2R2406)",
    description: "QLED display, 144Hz Fast Game Mode, 50W 2.1 channel Dynaudio speakers, Dolby Vision + Atmos.",
    price: 44999, originalPrice: 64999, category: "TVs", brand: "OnePlus",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 19, featured: true, rating: 4.4, numReviews: 4320,
    specifications: new Map([["Size","55 inch"],["Panel","QLED"],["Audio","50W Dynaudio 2.1"],["Refresh Rate","144Hz"]])
  },
  {
    name: "TCL 50-inch 4K HDR Google TV C61 Series (50C61B)",
    description: "AiPQ Engine 3.0, Dolby Vision + Atmos, Game Master Pro 144Hz, built-in Chromecast, Amazon Prime Video direct access.",
    price: 24999, originalPrice: 38999, category: "TVs", brand: "TCL",
    images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80"],
    stock: 52, featured: false, rating: 4.2, numReviews: 14320,
    specifications: new Map([["Size","50 inch"],["Engine","AiPQ 3.0"],["Gaming","Game Master Pro 144Hz"],["OS","Google TV"]])
  },
  {
    name: "Hisense 43-inch 4K Ultra HD QLED Smart Google TV (43E7NQ)",
    description: "Quantum Dot QLED panel, ALLM for gaming, Dolby Vision HDR, DTS Virtual:X surround, Hi-View Engine Pro.",
    price: 24999, originalPrice: 34999, category: "TVs", brand: "Hisense",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 29, featured: false, rating: 4.3, numReviews: 3210,
    specifications: new Map([["Size","43 inch"],["Panel","QLED Quantum Dot"],["Gaming","ALLM Auto"],["Audio","DTS Virtual:X"]])
  },
  {
    name: "Samsung 32-inch Full HD Smart LED TV 2024 (UA32T4380BKXXL)",
    description: "PurColor, Universal Guide, Bixby + Alexa + Google Assistant, HDMI x2, USB x1. Best budget Samsung TV.",
    price: 14990, originalPrice: 22900, category: "TVs", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 67, featured: false, rating: 4.2, numReviews: 18760,
    specifications: new Map([["Size","32 inch"],["Resolution","Full HD 1080p"],["OS","Tizen SmartTV"],["Voice","Alexa + Google + Bixby"]])
  },
  {
    name: "LG 43-inch Full HD Smart LED TV (43LM5750PTC)",
    description: "Full HD Active HDR, webOS 23, ThinQ AI, Virtual Surround Plus 20W, multiple HDMI and USB ports.",
    price: 26990, originalPrice: 37990, category: "TVs", brand: "LG",
    images: ["https://images.unsplash.com/photo-1601944177325-f8867652837f?w=500&q=80"],
    stock: 31, featured: false, rating: 4.2, numReviews: 7640,
    specifications: new Map([["Size","43 inch"],["Resolution","Full HD"],["Audio","Virtual Surround 20W"],["OS","webOS 23"]])
  },
  {
    name: "Vu 50-inch Premium 4K Ultra HD LED Smart TV (50-OA)",
    description: "ActiVoice remote with Alexa + Google, Master Picture Engine, bezel-less design, Dolby audio, 30W speakers.",
    price: 21999, originalPrice: 34999, category: "TVs", brand: "Vu",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80"],
    stock: 44, featured: false, rating: 4.1, numReviews: 12430,
    specifications: new Map([["Size","50 inch"],["Resolution","4K Ultra HD"],["Audio","Dolby 30W"],["Voice","Alexa + Google"]])
  },

  // ═══════════════ TABLETS (8) ═══════════════
  {
    name: "Apple iPad (10th Generation) 10.9-inch Wi-Fi 64GB - Blue",
    description: "A14 Bionic chip, 12MP Wide back camera, 12MP Ultra Wide front camera, USB-C connector, Wi-Fi 6, all-day battery.",
    price: 33900, originalPrice: 44900, category: "Tablets", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"],
    stock: 54, featured: true, rating: 4.7, numReviews: 12340,
    specifications: new Map([["Chip","A14 Bionic"],["Display","10.9-inch Liquid Retina"],["Storage","64GB"],["Connector","USB-C"]])
  },
  {
    name: "Apple iPad Pro 11-inch M4 Wi-Fi 256GB - Space Black",
    description: "Ultra Retina XDR OLED display, M4 chip, Apple Pencil Pro and Magic Keyboard support, thinnest Apple product ever made.",
    price: 99900, originalPrice: 99900, category: "Tablets", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"],
    stock: 14, featured: true, rating: 4.8, numReviews: 2134,
    specifications: new Map([["Chip","Apple M4"],["Display","11-inch Ultra Retina XDR OLED"],["Storage","256GB"],["Pencil","Apple Pencil Pro"]])
  },
  {
    name: "Samsung Galaxy Tab S9 FE+ 5G (12GB+256GB, Lavender)",
    description: "12.4-inch Dynamic AMOLED 2X, S Pen included in box, Exynos 1380, 10090mAh battery, Samsung DeX, IP68 rating.",
    price: 49999, originalPrice: 64999, category: "Tablets", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1623126908029-58c0c5e69dd8?w=500&q=80"],
    stock: 21, featured: true, rating: 4.5, numReviews: 1876,
    specifications: new Map([["Display","12.4-inch Dynamic AMOLED 2X"],["Battery","10090mAh"],["S Pen","Included"],["Rating","IP68"]])
  },
  {
    name: "Lenovo Idea Tab Smartchoice 5G+WiFi 11-inch 2.5K 8GB+256GB (Grey)",
    description: "Dimensity 6300, Android 15, 4-speaker Dolby Atmos, 500 nits brightness, expandable up to 2TB, 7040mAh. Amazon India.",
    price: 24999, originalPrice: 33999, category: "Tablets", brand: "Lenovo",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"],
    stock: 38, featured: false, rating: 4.3, numReviews: 2340,
    specifications: new Map([["Chip","Dimensity 6300"],["Display","11-inch 2.5K 500nits"],["Storage","256GB + 2TB expandable"],["Audio","4-speaker Dolby Atmos"]])
  },
  {
    name: "Xiaomi Pad 7 Pro 8GB+256GB WiFi (Lavender Purple)",
    description: "11.2-inch 3.2K 144Hz OLED display, Snapdragon 8s Gen 3, 10100mAh, 67W turbo charging, Xiaomi HyperOS 2.",
    price: 36999, originalPrice: 44999, category: "Tablets", brand: "Xiaomi",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"],
    stock: 29, featured: false, rating: 4.4, numReviews: 1432,
    specifications: new Map([["Display","11.2-inch 3.2K 144Hz OLED"],["Chip","Snapdragon 8s Gen 3"],["Battery","10100mAh"],["Charging","67W"]])
  },
  {
    name: "OnePlus Pad Lite 9340mAh 11-inch LTE 8GB+128GB (Aero Blue)",
    description: "Biggest battery in segment 9340mAh, 500 nits brightness, Helio G99s, 11 hours video, 33W SUPERVOOC. Amazon India.",
    price: 19999, originalPrice: 26999, category: "Tablets", brand: "OnePlus",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"],
    stock: 43, featured: false, rating: 4.2, numReviews: 3210,
    specifications: new Map([["Battery","9340mAh"],["Display","11-inch 500nits"],["Chip","Helio G99s"],["Charging","33W SUPERVOOC"]])
  },
  {
    name: "realme Pad X 6GB+128GB WiFi (Glacier Blue)",
    description: "11-inch 2K display 120Hz, Snapdragon 695, quad speakers Dolby Atmos, 8340mAh battery, 33W Dart Charge.",
    price: 18999, originalPrice: 25999, category: "Tablets", brand: "realme",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"],
    stock: 41, featured: false, rating: 4.1, numReviews: 2134,
    specifications: new Map([["Display","11-inch 2K 120Hz"],["Chip","Snapdragon 695"],["Battery","8340mAh"],["Charging","33W Dart Charge"]])
  },
  {
    name: "Samsung Galaxy Tab A9+ 4GB+64GB Wi-Fi (Graphite)",
    description: "11-inch display, Snapdragon 695, quad speakers Dolby Atmos, kids mode, lightweight metal body, 7040mAh battery.",
    price: 17999, originalPrice: 21999, category: "Tablets", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"],
    stock: 67, featured: false, rating: 4.2, numReviews: 8760,
    specifications: new Map([["Display","11 inch"],["Chip","Snapdragon 695"],["Battery","7040mAh"],["Audio","Quad Speaker Dolby"]])
  },

  // ═══════════════ ACCESSORIES (22) ═══════════════
  {
    name: "Apple Watch Series 10 (GPS 42mm) Jet Black Aluminium",
    description: "Largest Apple Watch display ever, thinnest design ever, Advanced health sensors, watchOS 11, 18hr battery life.",
    price: 46900, originalPrice: 49900, category: "Accessories", brand: "Apple",
    images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&q=80"],
    stock: 34, featured: true, rating: 4.7, numReviews: 6540,
    specifications: new Map([["Design","Thinnest Apple Watch ever"],["Display","Largest Apple Watch display"],["Battery","18 hours"],["OS","watchOS 11"]])
  },
  {
    name: "Samsung Galaxy Watch 6 (40mm, Bluetooth, Graphite)",
    description: "Advanced sleep coaching, body composition analysis, BioActive Sensor, 40-hour battery, 5ATM + IP68. Amazon India.",
    price: 24999, originalPrice: 29999, category: "Accessories", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 51, featured: false, rating: 4.5, numReviews: 7654,
    specifications: new Map([["Display","Super AMOLED"],["Battery","40 hours"],["Sensors","BioActive Sensor"],["Water","5ATM + IP68"]])
  },
  {
    name: "Noise Twist Round Dial BT Calling 1.38-inch 7-Day Battery IP68 (Jet Black)",
    description: "100+ Watch Faces, Heart Rate, Sleep Tracking, Stress Monitor. Amazon Bestseller smartwatch Rs 1499.",
    price: 1499, originalPrice: 4999, category: "Accessories", brand: "Noise",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 312, featured: true, rating: 3.9, numReviews: 54321,
    specifications: new Map([["Display","1.38-inch TFT"],["Battery","7 days"],["Calling","Bluetooth"],["Rating","IP68"]])
  },
  {
    name: "boAt Wave Sigma 3 TBT Navigation 2.01-inch BT Calling Crest+ OS (Active Black)",
    description: "Turn-by-turn navigation, Watch Face Studio, Coins system, Emergency SOS, Crest+ OS. Amazon bestseller smartwatch 2025.",
    price: 1999, originalPrice: 6990, category: "Accessories", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 234, featured: false, rating: 4.0, numReviews: 32100,
    specifications: new Map([["Display","2.01-inch HD"],["Navigation","Turn-by-Turn"],["OS","Crest+"],["Safety","Emergency SOS"]])
  },
  {
    name: "Fire-Boltt Ninja Call Pro Plus 1.83-inch BT Calling AI Voice 120+ Sports (Black)",
    description: "IP67 waterproof, SpO2, heart rate monitor, 120+ sports modes, customisable watch faces. Amazon bestseller smartwatch.",
    price: 1199, originalPrice: 5999, category: "Accessories", brand: "Fire-Boltt",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 423, featured: false, rating: 3.9, numReviews: 67890,
    specifications: new Map([["Display","1.83-inch HD"],["Voice","AI Assistant"],["Sports","120+ Modes"],["Rating","IP67"]])
  },
  {
    name: "Noise Pulse 2 Max 1.85-inch BT Calling 10-Day Battery 550 Nits (Midnight Blue)",
    description: "Smart DND, 100 Sports Modes, SpO2, Heart Rate, Stress monitoring. Amazon India bestseller under Rs 2000.",
    price: 1499, originalPrice: 4999, category: "Accessories", brand: "Noise",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 289, featured: false, rating: 4.0, numReviews: 32100,
    specifications: new Map([["Display","1.85-inch 550 nits"],["Battery","10 days"],["Calling","Bluetooth"],["Sports","100 Modes"]])
  },
  {
    name: "Ambrane Magsafe Wireless 10000mAh 22.5W Power Bank MagSafe (Blue)",
    description: "Strong magnet compatible with iPhone 12+, 22.5W output, Qi for Android, magnetic ring adapter included. Amazon Bestseller.",
    price: 1799, originalPrice: 3999, category: "Accessories", brand: "Ambrane",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80"],
    stock: 187, featured: true, rating: 4.2, numReviews: 23450,
    specifications: new Map([["Capacity","10000mAh"],["Output","22.5W"],["Magnet","MagSafe Compatible"],["Ring","Magnetic Ring Included"]])
  },
  {
    name: "Anker PowerCore 20100mAh Portable Charger (Black)",
    description: "20100mAh capacity, 2 USB-A ports, high-speed charging via PowerIQ, travel-friendly compact design. Amazon India.",
    price: 2999, originalPrice: 4999, category: "Accessories", brand: "Anker",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80"],
    stock: 156, featured: false, rating: 4.5, numReviews: 18760,
    specifications: new Map([["Capacity","20100mAh"],["Ports","2 USB-A"],["Tech","PowerIQ"],["Compatible","All smartphones"]])
  },
  {
    name: "Ambrane Unbreakable 3A Fast Charging 1.5m Braided Type-C Cable QC 3.0 (Black)",
    description: "480Mbps data sync, Quick Charge 3.0, 1.5m braided nylon, tangle-free design. Amazon Bestseller cable Model RCT15A.",
    price: 199, originalPrice: 699, category: "Accessories", brand: "Ambrane",
    images: ["https://images.unsplash.com/photo-1591290619762-c180a3eef4f0?w=500&q=80"],
    stock: 567, featured: false, rating: 4.3, numReviews: 43210,
    specifications: new Map([["Length","1.5m"],["Charging","3A Fast / QC 3.0"],["Data","480Mbps Sync"],["Build","Braided Unbreakable"]])
  },
  {
    name: "Samsung Original 25W USB Type-C Travel Adaptor (White) - No Cable",
    description: "Compatible with Galaxy S25/S24/M-series, Google Pixel, Xiaomi, Motorola, iPhone 15+. Amazon India official Samsung.",
    price: 649, originalPrice: 1099, category: "Accessories", brand: "Samsung",
    images: ["https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500&q=80"],
    stock: 432, featured: false, rating: 4.4, numReviews: 34521,
    specifications: new Map([["Power","25W"],["Type","USB-C"],["Compatibility","Universal"],["Official","Samsung Genuine"]])
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse 8000 DPI (Graphite)",
    description: "Ultra-fast MagSpeed electromagnetic scrolling, 8000 DPI sensor, near-silent clicks, multi-device, 70-day battery.",
    price: 8995, originalPrice: 11995, category: "Accessories", brand: "Logitech",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"],
    stock: 64, featured: false, rating: 4.7, numReviews: 9870,
    specifications: new Map([["DPI","200-8000"],["Battery","70 days"],["Connectivity","Bluetooth / USB"],["Buttons","7 programmable"]])
  },
  {
    name: "Portronics Toad One BT Mouse Dual Wireless 6-Button RGB Rechargeable (Black)",
    description: "2.4GHz + BT 5.3, connect up to 3 devices simultaneously, ergonomic design for laptop. Amazon bestseller wireless mouse.",
    price: 999, originalPrice: 1999, category: "Accessories", brand: "Portronics",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"],
    stock: 213, featured: false, rating: 4.2, numReviews: 12340,
    specifications: new Map([["Connectivity","2.4GHz + BT 5.3"],["Devices","Connect up to 3"],["Buttons","6 + Scroll"],["Power","Rechargeable"]])
  },
  {
    name: "ZEBRONICS Blanc Slim Wireless Mouse Rechargeable 4-Button 1600 DPI LED (White)",
    description: "Silent clicks, multicolor LED, ergonomic slim design, rechargeable via USB-C. Amazon bestseller slim wireless mouse.",
    price: 599, originalPrice: 1499, category: "Accessories", brand: "ZEBRONICS",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"],
    stock: 278, featured: false, rating: 4.1, numReviews: 18760,
    specifications: new Map([["DPI","800/1200/1600"],["Connectivity","BT + 2.4GHz"],["Power","Rechargeable"],["Buttons","4 Silent"]])
  },
  {
    name: "SanDisk Extreme Pro 1TB Portable SSD USB 3.2 Gen 2x2",
    description: "Up to 2000MB/s read, IP55 water and dust resistance, 2m drop-proof, password protection, USB 3.2 Gen 2x2.",
    price: 11999, originalPrice: 16999, category: "Accessories", brand: "SanDisk",
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80"],
    stock: 52, featured: false, rating: 4.6, numReviews: 4321,
    specifications: new Map([["Capacity","1TB"],["Speed","Up to 2000MB/s"],["Durability","IP55 + 2m drop"],["Interface","USB 3.2 Gen 2x2"]])
  },
  {
    name: "WD My Passport 2TB External Hard Drive USB 3.2 (Blue)",
    description: "Password protection with AES 256-bit hardware encryption, automatic backup software included, slim design.",
    price: 6499, originalPrice: 8999, category: "Accessories", brand: "Western Digital",
    images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80"],
    stock: 102, featured: false, rating: 4.5, numReviews: 19870,
    specifications: new Map([["Capacity","2TB"],["Interface","USB 3.2"],["Encryption","256-bit AES"],["Compatibility","Windows, Mac"]])
  },
  {
    name: "Casio FX-350MS 2nd Gen Scientific Calculator 240 Functions (Black)",
    description: "240 functions, 2-line display, non-programmable, board exam approved for JEE/NEET. Amazon Bestseller calculator.",
    price: 799, originalPrice: 1199, category: "Accessories", brand: "Casio",
    images: ["https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&q=80"],
    stock: 543, featured: false, rating: 4.6, numReviews: 45231,
    specifications: new Map([["Functions","240"],["Display","2-Line"],["Type","Non-programmable Scientific"],["Approval","JEE/NEET Board Approved"]])
  },
  {
    name: "Kratos Selfie Stick Tripod with Bluetooth Remote 3-in-1 Extendable 70cm (Black)",
    description: "Compatible with all Android and iOS phones, extends to 70cm, Bluetooth remote shutter included. Amazon Bestseller.",
    price: 499, originalPrice: 1299, category: "Accessories", brand: "Kratos",
    images: ["https://images.unsplash.com/photo-1553481187-be93c21490a9?w=500&q=80"],
    stock: 456, featured: false, rating: 4.2, numReviews: 32100,
    specifications: new Map([["Type","3-in-1 Selfie Stick + Tripod"],["Remote","Bluetooth Wireless"],["Compatibility","All Smartphones"],["Extend","Up to 70cm"]])
  },
  {
    name: "Dyazo 6-Angle Aluminium Foldable Laptop Stand Riser (Silver)",
    description: "Ergonomic adjustable stand, 6 height angles, compatible with all laptops up to 17 inch, MacBook, HP, Dell, Lenovo.",
    price: 999, originalPrice: 2499, category: "Accessories", brand: "Dyazo",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80"],
    stock: 312, featured: false, rating: 4.3, numReviews: 21340,
    specifications: new Map([["Material","Aluminium"],["Angles","6 Adjustable"],["Foldable","Yes Portable"],["Compatibility","All laptops up to 17 inch"]])
  },
  {
    name: "DIVIJA Wood Multipurpose Foldable Laptop Table with Cup Holder (Black, 59cm)",
    description: "Multipurpose study/bed/breakfast table, non-slip legs, rounded edges, ergonomic portable design. Amazon Bestseller.",
    price: 699, originalPrice: 1799, category: "Accessories", brand: "DIVIJA STORE",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"],
    stock: 387, featured: false, rating: 4.3, numReviews: 28760,
    specifications: new Map([["Material","Wood"],["Height","59cm"],["Cup Holder","Yes"],["Use","Laptop/Study/Bed"]])
  },
  {
    name: "Belkin BoostCharge Wireless Charging Pad 15W (White)",
    description: "Fast wireless charging for iPhone 15/14/13 and Qi-enabled Android, LED indicator, anti-slip design, 4-foot cable included.",
    price: 1799, originalPrice: 2999, category: "Accessories", brand: "Belkin",
    images: ["https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500&q=80"],
    stock: 78, featured: false, rating: 4.3, numReviews: 4320,
    specifications: new Map([["Power","15W"],["Compatibility","Qi + iPhone MagSafe"],["LED","Charging Indicator"],["Cable","4ft included"]])
  },
  {
    name: "boAt Storm Call 3 TBT Navigation 700+ Sports 1.83-inch HD DIY Faces (Black)",
    description: "Daily Activity Tracker, Watch Face Studio, Coins system, Emergency SOS, 700+ sports modes. Amazon smartwatch bestseller 2025.",
    price: 1799, originalPrice: 5990, category: "Accessories", brand: "boAt",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"],
    stock: 198, featured: false, rating: 4.0, numReviews: 21340,
    specifications: new Map([["Display","1.83-inch HD"],["Sports","700+ Active Modes"],["Navigation","Turn-by-Turn"],["Safety","Emergency SOS"]])
  },
  {
    name: "AmazonBasics 2nd Gen Stylus Pen for iPad 2018-2025 (White)",
    description: "Compatible with all iPad models 2018-2025 including Air M2/M3, mini 5/6, iPad 9/10, Pro 11/12.9, M4. Amazon official stylus.",
    price: 1299, originalPrice: 2499, category: "Accessories", brand: "AmazonBasics",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80"],
    stock: 198, featured: false, rating: 4.2, numReviews: 8760,
    specifications: new Map([["Compatible","iPad 2018-2025 all models"],["Gen","2nd Generation Upgraded"],["Color","White"],["Brand","Amazon Official"]])
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    const createdUsers = await User.create(users);
    console.log('✅ Created', createdUsers.length, 'users');
    console.log('  Admin : admin@electroshop.com / admin123');
    console.log('  User  : rahul@example.com / password123');

    await Product.create(products);
    console.log('✅ Created', products.length, 'products');

    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log('\n  Category breakdown:', byCategory);
    console.log('\n🎉 DB seeded with real Amazon.in / Flipkart products!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();