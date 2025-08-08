// This file contains functions to generate trip data based on user preferences
// In a real application, this would fetch data from APIs or a database

import { format, addDays } from "date-fns"

// Types for our trip data
export interface Attraction {
  name: string
  description: string
  image: string
  location: string
  category: string[]
  sourceUrl: string
  weatherInfo?: {
    condition: string
    temperature: string
    icon: string
  }
  roadInfo?: {
    status: "Open" | "Caution" | "Closed"
    roadNumber: string
  }
  timeOfDay?: "Morning" | "Afternoon" | "Evening"
}

export interface Accommodation {
  name: string
  location: string
  description: string
  image?: string
  sourceUrl: string
}

export interface DayPlan {
  date: string
  attractions: Attraction[]
  accommodation?: Accommodation
  weatherSummary: {
    condition: string
    temperature: string
    icon: string
  }
}

export interface TripData {
  title: string
  region: string
  duration: number
  startDate: string
  endDate: string
  days: DayPlan[]
  weatherForecast: {
    date: string
    condition: string
    temperature: string
    icon: string
  }[]
  roadConditions: {
    road: string
    status: "Open" | "Caution" | "Closed"
  }[]
  recommendedGear: string[]
  sourceWebsites: {
    name: string
    url: string
  }[]
}

// Database of attractions sourced from inspiredbyiceland.com and guidetoiceland.is
const attractions: Attraction[] = [
  {
    name: "Blue Lagoon",
    description:
      "The Blue Lagoon is a geothermal spa in southwestern Iceland. The spa is located in a lava field near Grindavík on the Reykjanes Peninsula. The warm waters are rich in minerals like silica and sulfur and bathing in the Blue Lagoon is reputed to help some people suffering from skin diseases such as psoriasis.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Reykjanes Peninsula",
    category: ["relaxation", "hot_springs"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/geothermal/the-blue-lagoon",
  },
  {
    name: "Gullfoss Waterfall",
    description:
      "Gullfoss is one of Iceland's most iconic and beloved waterfalls, found in the Hvítá river canyon in southwest Iceland. The water plummets down 32 meters in two stages into a rugged canyon with walls reaching up to 70 meters in height.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/gullfoss",
  },
  {
    name: "Þingvellir National Park",
    description:
      "Þingvellir National Park is a site of historical, cultural, and geological significance. It is the location of the oldest parliament in the world, the Althing, which was established in 930 AD. The park is located in a rift valley that marks the boundary between the North American and Eurasian tectonic plates.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["nature", "culture"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/national-parks/thingvellir-national-park",
  },
  {
    name: "Geysir Geothermal Area",
    description:
      "The Geysir geothermal area is home to the famous Strokkur geyser, which erupts every 5-10 minutes, shooting a column of water up to 30 meters into the air. The area is one of Iceland's most famous tourist attractions and part of the popular Golden Circle route.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/geysir",
  },
  {
    name: "Reynisfjara Black Sand Beach",
    description:
      "Reynisfjara is a world-famous black-sand beach found on the South Coast of Iceland, just beside the small fishing village of Vík í Mýrdal. It is widely considered to be the most beautiful example of Iceland's black sand beaches, featuring an amazing cliff of regular basalt columns resembling a rocky step pyramid.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/reynisfjara",
  },
  {
    name: "Jökulsárlón Glacier Lagoon",
    description:
      "Jökulsárlón is a large glacial lake in southeast Iceland, on the edge of Vatnajökull National Park. Situated at the head of the Breiðamerkurjökull glacier, it developed into a lake after the glacier started receding from the edge of the Atlantic Ocean. The lake has grown because of melting glaciers and is now 1.5 kilometers away from the ocean's edge.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/glaciers/jokulsarlon-glacier-lagoon",
  },
  {
    name: "Diamond Beach",
    description:
      "The Diamond Beach is a strip of black sand belonging to the greater Breiðamerkursandur glacial plain, located by Jökulsárlón glacier lagoon on the South Coast of Iceland. Here, the icebergs which fill Jökulsárlón glacier lagoon wash up on shore, standing dazzling and defiant in stark contrast to the black sand beach.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/diamond-beach",
  },
  {
    name: "Skógafoss Waterfall",
    description:
      "Skógafoss is one of the biggest waterfalls in Iceland with a drop of 60 meters and a width of 25 meters. According to legend, the first Viking settler in the area, Þrasi Þórólfsson, buried a treasure in a cave behind the waterfall. The legend continues that locals found the chest years later, but were only able to grasp the ring on the side of the chest before it disappeared again.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/waterfalls/skogafoss",
  },
  {
    name: "Seljalandsfoss Waterfall",
    description:
      "Seljalandsfoss is a waterfall that can be fully encircled, situated on the South Coast of Iceland with a drop of 60 meters. It is part of the Seljalands River that has its origin in the volcano glacier Eyjafjallajökull. One of the interesting things about this waterfall is that visitors can walk behind it into a small cave.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/seljalandsfoss",
  },
  {
    name: "Kirkjufell Mountain",
    description:
      "Kirkjufell is a 463 meter high mountain on the north coast of Iceland's Snæfellsnes Peninsula, near the town of Grundarfjörður. It is one of the most photographed mountains in Iceland, often captured with Kirkjufellsfoss waterfall in the foreground. The mountain has been featured in Game of Thrones as 'Arrowhead Mountain'.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Snæfellsnes Peninsula",
    category: ["nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/mountains/kirkjufell",
  },
  {
    name: "Snæfellsjökull National Park",
    description:
      "Snæfellsjökull National Park is located on the westernmost tip of the Snæfellsnes Peninsula. The park's centerpiece is the 700,000-year-old glacier-capped stratovolcano Snæfellsjökull, which was featured in Jules Verne's novel 'Journey to the Center of the Earth'.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Snæfellsnes Peninsula",
    category: ["nature", "adventure"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/snaefellsjokull",
  },
  {
    name: "Dynjandi Waterfall",
    description:
      "Dynjandi is a series of waterfalls located in the Westfjords and is often considered the most beautiful waterfall in Iceland. The waterfall is a collection of seven cascades, with the largest being 100 meters tall. Its name means 'thunderous' in Icelandic, which is fitting given the powerful sound it produces.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Westfjords",
    category: ["nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/waterfalls/dynjandi",
  },
  {
    name: "Dettifoss Waterfall",
    description:
      "Dettifoss is the most powerful waterfall in Europe, located in Vatnajökull National Park in Northeast Iceland. The water comes from the nearby Vatnajökull glacier, whose sediment-rich runoff colors the water a greyish white. The waterfall is 100 meters wide and has a drop of 44 meters down to the Jökulsárgljúfur canyon.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/dettifoss",
  },
  {
    name: "Myvatn Nature Baths",
    description:
      "The Mývatn Nature Baths are located in the Lake Mývatn geothermal area in North Iceland. The alkaline bathing lagoon offers a peaceful setting to relax and enjoy the health benefits of the geothermal waters, which are rich in minerals and said to be good for skin conditions.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["relaxation", "hot_springs"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/geothermal/myvatn-nature-baths",
  },
  {
    name: "Ásbyrgi Canyon",
    description:
      "Ásbyrgi is a horseshoe-shaped canyon in the northeast of Iceland, part of the Vatnajökull National Park. The canyon is about 3.5 km long and 1 km wide, with walls up to 100 meters high. According to Norse mythology, the canyon was formed when Odin's eight-legged horse, Sleipnir, touched one of its feet to the ground.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["nature", "culture"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/asbyrgi",
  },
  {
    name: "Hallgrímskirkja",
    description:
      "Hallgrímskirkja is a Lutheran parish church in Reykjavík, Iceland. At 74.5 meters high, it is the largest church in Iceland and among the tallest structures in the country. The church is named after the Icelandic poet and clergyman Hallgrímur Pétursson, author of the Passion Hymns.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Reykjavík",
    category: ["culture"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/culture/architecture/hallgrimskirkja",
  },
  {
    name: "Harpa Concert Hall",
    description:
      "Harpa is a concert hall and conference center in Reykjavík, Iceland. The building features a distinctive colored glass facade inspired by the basalt landscape of Iceland. It was designed by the Danish firm Henning Larsen Architects in co-operation with Danish-Icelandic artist Olafur Eliasson.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Reykjavík",
    category: ["culture"],
    sourceUrl: "https://guidetoiceland.is/reykjavik-guide/harpa-concert-hall-and-conference-centre",
  },
  {
    name: "Landmannalaugar",
    description:
      "Landmannalaugar is a place in the Fjallabak Nature Reserve in the Highlands of Iceland. It is at the edge of Laugahraun lava field, which was formed in an eruption around the year 1477. It is known for its natural geothermal hot springs and surrounding landscape.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Highlands",
    category: ["nature", "adventure", "hot_springs"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/highlands/landmannalaugar",
  },
  {
    name: "Þórsmörk",
    description:
      "Þórsmörk is a mountain ridge in Iceland that was named after the Norse god Thor. It is situated in the south of Iceland, between the glaciers Tindfjallajökull and Eyjafjallajökull. The area is a popular hiking destination and nature reserve.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Highlands",
    category: ["nature", "adventure"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/thorsmork",
  },
  {
    name: "Reykjadalur Hot Spring Thermal River",
    description:
      "Reykjadalur (literally 'Steam Valley') is a geothermal area and hot spring river near the town of Hveragerði. After a hike of about 3 kilometers, visitors can bathe in the naturally hot river. The temperature of the water varies by location, allowing visitors to find their perfect bathing spot.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature", "hot_springs", "adventure"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/geothermal/reykjadalur-hot-spring-thermal-river",
  },
  {
    name: "Whale Watching in Húsavík",
    description:
      "Húsavík is known as the whale watching capital of Iceland. The town offers some of the best whale watching tours in the country, with a high chance of spotting various species including minke whales, humpback whales, and even blue whales during the summer months.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["wildlife", "adventure"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/husavik",
  },
  {
    name: "Silfra Fissure",
    description:
      "Silfra is a fissure between the North American and Eurasian tectonic plates in Þingvellir National Park. It is filled with crystal clear glacial water filtered through porous underground lava for 30-100 years. Silfra is one of the top diving sites in the world due to its clear visibility and unique location.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["adventure", "nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/diving-and-snorkeling/silfra",
  },
  {
    name: "Perlan Museum",
    description:
      "Perlan ('The Pearl') is a prominent landmark in Reykjavík, built in 1991. It houses a museum with exhibitions on Icelandic nature, including a real indoor ice cave, a planetarium, and an observation deck offering panoramic views of the city and surrounding areas.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Reykjavík",
    category: ["culture"],
    sourceUrl: "https://guidetoiceland.is/reykjavik-guide/perlan-museum-reykjavik",
  },
  {
    name: "Laugavegur Hiking Trail",
    description:
      "The Laugavegur is Iceland's most famous hiking trail, connecting the interior landscapes of Landmannalaugar and Þórsmörk. The 55 km trail typically takes 2-4 days to complete and passes through diverse landscapes including colorful rhyolite mountains, black sand deserts, and green valleys.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Highlands",
    category: ["adventure", "nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/activities/hiking/laugavegur-hiking-trail",
  },
  {
    name: "Skaftafell Nature Reserve",
    description:
      "Skaftafell is a preservation area in Vatnajökull National Park, located between Kirkjubæjarklaustur and Höfn in the south of Iceland. It is known for its diverse landscape, including glaciers, waterfalls, and mountains. The area offers numerous hiking trails and is home to Svartifoss, a waterfall surrounded by black basalt columns.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature", "adventure"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/skaftafell",
  },
  {
    name: "Akureyri",
    description:
      "Akureyri is Iceland's second largest urban area and the largest town outside the Greater Reykjavík area. It's known as the 'Capital of North Iceland' and is an important port and fishing center. The town has a charming downtown with colorful houses, good museums, and is a gateway to many natural attractions in North Iceland.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["culture", "food"],
    sourceUrl: "https://www.inspiredbyiceland.com/place/akureyri",
  },
  {
    name: "Húsavík",
    description:
      "Húsavík is a charming fishing town on the north coast of Iceland, known as the whale watching capital of Europe. The town offers excellent opportunities to see various whale species in their natural habitat, including minke whales, humpback whales, and even blue whales during summer months.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["wildlife", "culture"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/husavik",
  },
  {
    name: "Eastfjords",
    description:
      "The Eastfjords of Iceland are a series of beautiful fjords with small fishing villages, steep mountains, and diverse wildlife. This remote area is less visited than other parts of Iceland, offering a more authentic experience away from the crowds. The region is known for its wild reindeer population, the only place in Iceland where they can be found.",
    image: "/placeholder.svg?height=400&width=600",
    location: "East Iceland",
    category: ["nature", "wildlife"],
    sourceUrl: "https://www.inspiredbyiceland.com/regions/east-iceland",
  },
  {
    name: "Stuðlagil Canyon",
    description:
      "Stuðlagil Canyon is a relatively new attraction in East Iceland, revealed when water levels dropped after the construction of the Kárahnjúkar dam. The canyon features spectacular basalt column formations along the Jökulsá á Dal river, creating one of Iceland's most impressive geological sites.",
    image: "/placeholder.svg?height=400&width=600",
    location: "East Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/connect-with-locals/regina/studlagil-canyon-in-east-iceland",
  },
  {
    name: "Raufarhólshellir Lava Tunnel",
    description:
      "Raufarhólshellir is one of the longest and best-known lava tubes in Iceland. Formed in a volcanic eruption about 5,200 years ago, this lava tunnel offers visitors a chance to explore the inner workings of a volcanic eruption. Guided tours take you through colorful cave formations and unique lava features.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["adventure", "nature"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/caves/raufarholshellir",
  },
  {
    name: "Hornstrandir Nature Reserve",
    description:
      "Hornstrandir Nature Reserve is Iceland's most remote area, located in the northernmost part of the Westfjords. Accessible only by boat during summer, this pristine wilderness offers untouched nature, dramatic cliffs, and abundant wildlife including Arctic foxes. It's a paradise for hikers seeking solitude and unspoiled landscapes.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Westfjords",
    category: ["nature", "adventure", "wildlife"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/hornstrandir",
  },
  {
    name: "Látrabjarg Bird Cliffs",
    description:
      "Látrabjarg is Europe's largest bird cliff and the westernmost point of Iceland. The cliffs stretch for 14 kilometers and reach heights of up to 440 meters. They're home to millions of birds including puffins, razorbills, and guillemots. It's one of the best places in Iceland to see puffins up close during summer months.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Westfjords",
    category: ["nature", "wildlife"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/bird-watching/latrabjarg",
  },
  {
    name: "Kerið Crater Lake",
    description:
      "Kerið is a volcanic crater lake located in the Golden Circle area. The crater is approximately 3,000 years old and features a vivid blue water lake surrounded by steep red and orange slopes. Visitors can walk around the rim of the crater and descend to the lake itself via a path.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/kerid",
  },
  {
    name: "Fjaðrárgljúfur Canyon",
    description:
      "Fjaðrárgljúfur is a magnificent canyon in southeast Iceland, about 100 meters deep and 2 kilometers long. The canyon was formed at the end of the last Ice Age, about 9,000 years ago. Visitors can hike along the rim of the canyon for spectacular views of the winding river below and the uniquely shaped cliffs.",
    image: "/placeholder.svg?height=400&width=600",
    location: "South Iceland",
    category: ["nature", "adventure"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/canyons/fjadrargljufur",
  },
  {
    name: "Hengifoss Waterfall",
    description:
      "Hengifoss is Iceland's third-highest waterfall at 128 meters. Located in East Iceland, it's known for its distinctive red clay and black basalt rock layers visible in the cliff face behind the waterfall. The hike to Hengifoss also passes by another beautiful waterfall called Litlanesfoss, known for its impressive basalt columns.",
    image: "/placeholder.svg?height=400&width=600",
    location: "East Iceland",
    category: ["nature"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/hengifoss",
  },
  {
    name: "Askja Caldera",
    description:
      "Askja is a remote volcanic caldera in the Icelandic Highlands, accessible only during summer months with a 4x4 vehicle. The area features a large lake called Öskjuvatn and a smaller geothermal lake called Víti (Hell) where visitors can bathe in the warm, mineral-rich water. The lunar-like landscape was used by NASA to train astronauts for the Apollo missions.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Highlands",
    category: ["nature", "adventure", "hot_springs"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/mountains/askja",
  },
  {
    name: "Arnarstapi",
    description:
      "Arnarstapi is a small fishing village on the southern side of the Snæfellsnes Peninsula. The area is known for its stunning coastal cliffs, unique rock formations, and abundant birdlife. A popular coastal walk connects Arnarstapi to the nearby village of Hellnar, offering spectacular views of basalt columns, arches, and sea stacks.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Snæfellsnes Peninsula",
    category: ["nature", "culture"],
    sourceUrl: "https://guidetoiceland.is/travel-iceland/drive/arnarstapi",
  },
  {
    name: "Goðafoss Waterfall",
    description:
      "Goðafoss (Waterfall of the Gods) is one of Iceland's most spectacular waterfalls, located in the Mývatn region of North Iceland. The waterfall is not only beautiful but historically significant. According to the Sagas, in the year 1000, the lawspeaker Þorgeir Ljósvetningagoði threw his pagan idols into the waterfall after Iceland's conversion to Christianity.",
    image: "/placeholder.svg?height=400&width=600",
    location: "North Iceland",
    category: ["nature", "culture"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/nature/waterfalls/godafoss",
  },
  {
    name: "Friðheimar Greenhouse",
    description:
      "Friðheimar is a family-run greenhouse and restaurant in South Iceland where visitors can learn about sustainable growing of tomatoes using geothermal heat. The on-site restaurant serves dishes made with their own tomatoes, including their famous tomato soup. It's a unique farm-to-table experience showcasing Icelandic innovation in agriculture.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Golden Circle",
    category: ["food", "culture"],
    sourceUrl: "https://guidetoiceland.is/connect-with-locals/jorunnsg/fridheimar-greenhouse-restaurant",
  },
  {
    name: "Laugavegur Shopping Street",
    description:
      "Laugavegur is the main shopping street in downtown Reykjavík and one of the oldest streets in the city. It's lined with boutiques, restaurants, cafés, bars, and galleries. The street is the heart of Reykjavík's shopping and nightlife scene, offering a mix of Icelandic design shops, international brands, and unique local businesses.",
    image: "/placeholder.svg?height=400&width=600",
    location: "Reykjavík",
    category: ["culture", "food"],
    sourceUrl: "https://www.inspiredbyiceland.com/things-to-do/shopping/laugavegur-shopping-street",
  },
]

// Database of accommodations
const accommodations: Accommodation[] = [
  {
    name: "Hotel Rangá",
    location: "South Iceland",
    description:
      "Hotel Rangá is a luxury countryside hotel and the only 4-star resort in South Iceland. It offers stunning views of the East Rangá River and surrounding mountains, and is an excellent location for Northern Lights viewing in winter.",
    sourceUrl: "https://guidetoiceland.is/accommodation/hotel-ranga",
  },
  {
    name: "Fosshotel Glacier Lagoon",
    location: "South Iceland",
    description:
      "Fosshotel Glacier Lagoon is a modern hotel located between Skaftafell and Jökulsárlón Glacier Lagoon. The hotel offers stunning views of the surrounding mountains and is an excellent base for exploring the natural wonders of Southeast Iceland.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/fosshotel-glacier-lagoon",
  },
  {
    name: "Hotel Húsafell",
    location: "West Iceland",
    description:
      "Hotel Húsafell is a luxury hotel located in the highlands of West Iceland. The hotel is surrounded by glaciers, lava fields, and geothermal springs, and offers activities such as hiking, golfing, and bathing in natural hot springs.",
    sourceUrl: "https://guidetoiceland.is/accommodation/hotel-husafell",
  },
  {
    name: "Icelandair Hotel Mývatn",
    location: "North Iceland",
    description:
      "Icelandair Hotel Mývatn is located in the heart of Northeast Iceland, near Lake Mývatn. The hotel offers comfortable rooms and is an excellent base for exploring the Lake Mývatn area, known for its unique geological features and rich birdlife.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/icelandair-hotel-myvatn",
  },
  {
    name: "Hotel Egilsen",
    location: "Snæfellsnes Peninsula",
    description:
      "Hotel Egilsen is a boutique hotel located in the heart of Stykkishólmur, a charming fishing town on the Snæfellsnes Peninsula. The hotel is housed in a historic building from 1867 and offers comfortable rooms with a blend of modern and traditional Icelandic design.",
    sourceUrl: "https://guidetoiceland.is/accommodation/hotel-egilsen",
  },
  {
    name: "Canopy by Hilton Reykjavík City Centre",
    location: "Reykjavík",
    description:
      "Canopy by Hilton Reykjavík City Centre is a stylish hotel located in the heart of Reykjavík. The hotel is within walking distance of many of the city's attractions, restaurants, and shops, making it an ideal base for exploring the capital.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/canopy-by-hilton-reykjavik",
  },
  {
    name: "Hótel Búðir",
    location: "Snæfellsnes Peninsula",
    description:
      "Hótel Búðir is a charming countryside hotel located on the Snæfellsnes Peninsula. The hotel is known for its picturesque setting, with views of the Snæfellsjökull glacier, surrounding mountains, and the sea. It's also famous for its small black church nearby.",
    sourceUrl: "https://guidetoiceland.is/accommodation/hotel-budir",
  },
  {
    name: "ION Adventure Hotel",
    location: "Golden Circle",
    description:
      "ION Adventure Hotel is a luxury hotel located near Þingvellir National Park. The hotel offers stunning views of the surrounding mountains and lava fields, and features a spa with a sauna and outdoor hot tub, perfect for relaxing after a day of exploring.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/ion-adventure-hotel",
  },
  {
    name: "Sigló Hótel",
    location: "North Iceland",
    description:
      "Sigló Hótel is a boutique hotel located in the heart of Siglufjörður, a charming fishing town in North Iceland. The hotel offers stunning views of the marina and mountains, and is an excellent base for exploring the natural beauty and rich history of the area.",
    sourceUrl: "https://guidetoiceland.is/accommodation/siglo-hotel",
  },
  {
    name: "Fosshotel Eastfjords",
    location: "East Iceland",
    description:
      "Fosshotel Eastfjords is located in the charming village of Fáskrúðsfjörður in East Iceland. The hotel is housed in a set of beautifully restored historical buildings that once served as a hospital for French fishermen in the early 20th century. It offers comfortable rooms with views of the fjord.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/fosshotel-eastfjords",
  },
  {
    name: "Hotel Húsafell Arctic Baths",
    location: "West Iceland",
    description:
      "Hotel Húsafell Arctic Baths is a luxury hotel featuring private geothermal baths with each room. Located in the highlands of West Iceland, the hotel offers a unique blend of luxury and nature, with sustainable design and access to numerous outdoor activities.",
    sourceUrl: "https://guidetoiceland.is/accommodation/hotel-husafell-arctic-baths",
  },
  {
    name: "Hótel Djúpavík",
    location: "Westfjords",
    description:
      "Hótel Djúpavík is a unique hotel located in a former herring factory in the remote Djúpavík village in the Westfjords. This historical hotel offers a glimpse into Iceland's past while providing comfortable accommodations in one of the country's most isolated and beautiful regions.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/hotel-djupavik",
  },
  {
    name: "The Retreat at Blue Lagoon",
    location: "Reykjanes Peninsula",
    description:
      "The Retreat at Blue Lagoon is a luxury hotel built into an 800-year-old lava flow on the shores of the Blue Lagoon. The hotel offers exclusive access to the Retreat Lagoon, a private section of the Blue Lagoon, as well as a subterranean spa, fine dining restaurant, and stunning minimalist design.",
    sourceUrl: "https://guidetoiceland.is/accommodation/the-retreat-at-blue-lagoon",
  },
  {
    name: "Torfhús Retreat",
    location: "Golden Circle",
    description:
      "Torfhús Retreat is a luxury accommodation inspired by traditional Icelandic turf houses. Located in the Golden Circle area, each unit features a private hot tub with views of the surrounding countryside and Langjökull glacier. The retreat combines traditional Icelandic design with modern luxury.",
    sourceUrl: "https://www.inspiredbyiceland.com/accommodation/torfhus-retreat",
  },
  {
    name: "Deplar Farm",
    location: "North Iceland",
    description:
      "Deplar Farm is a luxury lodge located in the remote Fljót Valley in North Iceland. Originally a sheep farm, it has been transformed into an exclusive retreat with geothermal pools, spa facilities, and access to outdoor adventures including heli-skiing, fly fishing, and horseback riding.",
    sourceUrl: "https://guidetoiceland.is/accommodation/deplar-farm",
  },
]

// Function to get weather data based on region and season
function getWeatherData(region: string, season: string) {
  const weatherConditions: Record<string, { condition: string; temperature: string; icon: string }[]> = {
    summer: [
      { condition: "Mostly Sunny", temperature: "10-15°C", icon: "sun" },
      { condition: "Partly Cloudy", temperature: "8-14°C", icon: "cloud-sun" },
      { condition: "Light Rain", temperature: "7-12°C", icon: "cloud-drizzle" },
    ],
    winter: [
      { condition: "Snow Showers", temperature: "-5-0°C", icon: "cloud-snow" },
      { condition: "Cloudy", temperature: "-2-3°C", icon: "cloud" },
      { condition: "Clear", temperature: "-8--2°C", icon: "moon" },
    ],
    spring: [
      { condition: "Rain Showers", temperature: "3-8°C", icon: "cloud-rain" },
      { condition: "Partly Cloudy", temperature: "5-10°C", icon: "cloud-sun" },
      { condition: "Windy", temperature: "4-9°C", icon: "wind" },
    ],
    fall: [
      { condition: "Cloudy", temperature: "2-7°C", icon: "cloud" },
      { condition: "Rain", temperature: "1-6°C", icon: "cloud-rain" },
      { condition: "Partly Sunny", temperature: "4-9°C", icon: "cloud-sun" },
    ],
  }

  return weatherConditions[season]
}

// Function to get road conditions based on region and season
function getRoadConditions(region: string, season: string) {
  const roadConditions: Record<string, { road: string; status: "Open" | "Caution" | "Closed" }[]> = {
    summer: [
      { road: "Road 1 (Ring Road)", status: "Open" },
      { road: "F-roads (Highlands)", status: "Open" },
      { road: "Mountain roads", status: "Open" },
    ],
    winter: [
      { road: "Road 1 (Ring Road)", status: "Caution" },
      { road: "F-roads (Highlands)", status: "Closed" },
      { road: "Mountain roads", status: "Closed" },
    ],
    spring: [
      { road: "Road 1 (Ring Road)", status: "Open" },
      { road: "F-roads (Highlands)", status: "Closed" },
      { road: "Mountain roads", status: "Caution" },
    ],
    fall: [
      { road: "Road 1 (Ring Road)", status: "Open" },
      { road: "F-roads (Highlands)", status: "Caution" },
      { road: "Mountain roads", status: "Caution" },
    ],
  }

  return roadConditions[season]
}

// Function to get recommended gear based on season
function getRecommendedGear(season: string) {
  const gear: Record<string, string[]> = {
    summer: [
      "Waterproof jacket",
      "Hiking boots",
      "Layers of clothing",
      "Sunglasses",
      "Camera",
      "Reusable water bottle",
      "Swimsuit for hot springs",
    ],
    winter: [
      "Warm, waterproof jacket",
      "Insulated boots",
      "Thermal layers",
      "Hat, gloves, and scarf",
      "Crampons for icy conditions",
      "Headlamp (limited daylight hours)",
      "Swimsuit for hot springs",
    ],
    spring: [
      "Waterproof jacket and pants",
      "Hiking boots",
      "Warm layers",
      "Hat and gloves",
      "Sunglasses",
      "Camera",
      "Swimsuit for hot springs",
    ],
    fall: [
      "Warm, waterproof jacket",
      "Waterproof boots",
      "Warm layers",
      "Hat and gloves",
      "Camera",
      "Headlamp (for darker evenings)",
      "Swimsuit for hot springs",
    ],
  }

  return gear[season]
}

// Function to filter attractions based on user preferences
function filterAttractions(region: string, interests: string[]) {
  let filteredAttractions = [...attractions]

  // Filter by region
  if (region !== "all") {
    filteredAttractions = filteredAttractions.filter((attraction) => {
      if (region === "golden_circle" && attraction.location === "Golden Circle") return true
      if (region === "south" && attraction.location === "South Iceland") return true
      if (region === "north" && attraction.location === "North Iceland") return true
      if (region === "east" && attraction.location === "East Iceland") return true
      if (region === "west" && attraction.location === "West Iceland") return true
      if (region === "westfjords" && attraction.location === "Westfjords") return true
      if (region === "highlands" && attraction.location === "Highlands") return true
      if (region === "reykjavik" && attraction.location === "Reykjavík") return true
      if (region === "snaefellsnes" && attraction.location === "Snæfellsnes Peninsula") return true
      return false
    })
  }

  // Filter by interests
  if (interests.length > 0) {
    filteredAttractions = filteredAttractions.filter((attraction) => {
      return attraction.category.some((category) => interests.includes(category))
    })
  }

  return filteredAttractions
}

// Function to get accommodations based on region
function getAccommodationsByRegion(region: string) {
  if (region === "all") return accommodations

  return accommodations.filter((accommodation) => {
    if (region === "golden_circle" && accommodation.location === "Golden Circle") return true
    if (region === "south" && accommodation.location === "South Iceland") return true
    if (region === "north" && accommodation.location === "North Iceland") return true
    if (region === "east" && accommodation.location === "East Iceland") return true
    if (region === "west" && accommodation.location === "West Iceland") return true
    if (region === "westfjords" && accommodation.location === "Westfjords") return true
    if (region === "highlands" && accommodation.location === "Highlands") return true
    if (region === "reykjavik" && accommodation.location === "Reykjavík") return true
    if (region === "snaefellsnes" && accommodation.location === "Snæfellsnes Peninsula") return true
    return false
  })
}

// Function to create a day plan
function createDayPlan(date: Date, attractions: Attraction[], accommodation: Accommodation | undefined, weather: any) {
  const morningAttraction = attractions[0] || null
  const afternoonAttraction = attractions[1] || null
  const eveningAttraction = attractions[2] || null

  if (morningAttraction) morningAttraction.timeOfDay = "Morning"
  if (afternoonAttraction) afternoonAttraction.timeOfDay = "Afternoon"
  if (eveningAttraction) eveningAttraction.timeOfDay = "Evening"

  const dayAttractions = [morningAttraction, afternoonAttraction, eveningAttraction].filter(Boolean) as Attraction[]

  return {
    date: format(date, "MMMM d, yyyy"),
    attractions: dayAttractions,
    accommodation,
    weatherSummary: weather,
  }
}

// Main function to generate trip data
export function getTrip(formValues: any): TripData {
  const { startDate, duration, region, interests, season } = formValues

  // Get filtered attractions based on preferences
  const filteredAttractions = filterAttractions(region, interests)

  // Get accommodations for the region
  const regionAccommodations = getAccommodationsByRegion(region)

  // Get weather data
  const weatherData = getWeatherData(region, season)

  // Get road conditions
  const roadConditions = getRoadConditions(region, season)

  // Get recommended gear
  const recommendedGear = getRecommendedGear(season)

  // Create weather forecast for the trip duration
  const weatherForecast = []
  for (let i = 0; i < duration; i++) {
    const date = addDays(startDate, i)
    weatherForecast.push({
      date: format(date, "MMMM d, yyyy"),
      ...weatherData[i % weatherData.length],
    })
  }

  // Create day plans
  const days = []
  for (let i = 0; i < duration; i++) {
    const date = addDays(startDate, i)

    // Select attractions for this day (3 per day)
    const dayAttractions = filteredAttractions.slice(i * 3, (i + 1) * 3)

    // Select accommodation for this day
    const accommodation = i < duration - 1 ? regionAccommodations[i % regionAccommodations.length] : undefined

    // Create day plan
    const dayPlan = createDayPlan(date, dayAttractions, accommodation, weatherData[i % weatherData.length])
    days.push(dayPlan)
  }

  // Determine region name for title
  let regionName = "Iceland"
  if (region === "golden_circle") regionName = "Golden Circle"
  else if (region === "south") regionName = "South Iceland"
  else if (region === "north") regionName = "North Iceland"
  else if (region === "east") regionName = "East Iceland"
  else if (region === "west") regionName = "West Iceland"
  else if (region === "westfjords") regionName = "Westfjords"
  else if (region === "highlands") regionName = "Highlands"
  else if (region === "reykjavik") regionName = "Reykjavík"
  else if (region === "snaefellsnes") regionName = "Snæfellsnes Peninsula"

  // Create trip title
  const tripTitle = `${duration}-Day ${regionName} Adventure`

  // Create trip data
  return {
    title: tripTitle,
    region: regionName,
    duration,
    startDate: format(startDate, "MMMM d, yyyy"),
    endDate: format(addDays(startDate, duration - 1), "MMMM d, yyyy"),
    days,
    weatherForecast,
    roadConditions,
    recommendedGear,
    sourceWebsites: [
      {
        name: "Inspired by Iceland",
        url: "https://www.inspiredbyiceland.com",
      },
      {
        name: "Guide to Iceland",
        url: "https://guidetoiceland.is",
      },
      {
        name: "SafeTravel.is",
        url: "https://safetravel.is",
      },
      {
        name: "Icelandic Met Office",
        url: "https://en.vedur.is",
      },
      {
        name: "Road.is",
        url: "https://www.road.is",
      },
      {
        name: "I Heart Reykjavík",
        url: "https://iheartreykjavik.net",
      },
    ],
  }
}
