// Catalog seed shared by the cloud Function (seed_demo) and the local fixture
// server. Real affiliate products recommended by Tatiana — Amazon.

export const SEED_CATEGORIES = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    slug: "viagens",
    names: { pt: "Viagens", en: "Travel", es: "Viajes", fr: "Voyages" },
    sort_order: 1,
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    slug: "eletronica",
    names: { pt: "Eletrónica", en: "Electronics", es: "Electrónica", fr: "Électronique" },
    sort_order: 2,
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    slug: "beleza",
    names: { pt: "Beleza & Higiene", en: "Beauty & Care", es: "Belleza & Higiene", fr: "Beauté & Hygiène" },
    sort_order: 3,
  },
];

export const SEED_STORES = [
  { id: "50000000-0000-4000-8000-000000000001", slug: "amazon", name: "Amazon", sort_order: 1 },
];

const AMAZON = "50000000-0000-4000-8000-000000000001";
const VIAGENS = "c0000000-0000-4000-8000-000000000001";
const ELETRONICA = "c0000000-0000-4000-8000-000000000002";
const BELEZA = "c0000000-0000-4000-8000-000000000003";

const product = (n, names, descriptions, image, url, category_id) => ({
  id: `90000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
  sort_order: n,
  active: true,
  names,
  descriptions,
  button_texts: {},
  image_url: image,
  affiliate_url: url,
  category_id,
  store_id: AMAZON,
});

export const SEED_PRODUCTS = [
  product(
    1,
    {
      pt: "Balança malas de viagem portátil",
      en: "Portable luggage scale",
      es: "Báscula portátil para maletas",
      fr: "Balance portable pour bagages",
    },
    {
      pt: "Balança de bagagem com ecrã LCD, até 110 lb/50 kg, para viagens ao ar livre, cinzento.",
      en: "Luggage scale with LCD screen, up to 110 lb/50 kg, for outdoor travel, grey.",
      es: "Báscula de equipaje con pantalla LCD, hasta 110 lb/50 kg, para viajes al aire libre, gris.",
      fr: "Balance à bagages avec écran LCD, jusqu'à 110 lb/50 kg, pour les voyages en plein air, gris.",
    },
    "/images/prod-01.webp",
    "https://amzn.to/4csNFQa",
    VIAGENS,
  ),
  product(
    2,
    {
      pt: "Almofada de viagem insuflável",
      en: "Inflatable travel pillow",
      es: "Almohada de viaje inflable",
      fr: "Oreiller de voyage gonflable",
    },
    {
      pt: "Almofada cervical para poupar espaço em malas em viagens de avião, comboio ou carro.",
      en: "Neck pillow that saves suitcase space on plane, train or car trips.",
      es: "Almohada cervical para ahorrar espacio en la maleta en viajes de avión, tren o coche.",
      fr: "Oreiller cervical pour gagner de la place dans la valise en avion, train ou voiture.",
    },
    "/images/prod-02.webp",
    "https://amzn.to/4cZLzaw",
    VIAGENS,
  ),
  product(
    3,
    {
      pt: "Adaptador de tomada universal",
      en: "Universal travel adapter",
      es: "Adaptador de enchufe universal",
      fr: "Adaptateur de prise universel",
    },
    {
      pt: "Adaptador universal para UE, Reino Unido, americano, Canadá, Austrália e 150 países.",
      en: "Universal adapter for EU, UK, US, Canada, Australia and 150 countries.",
      es: "Adaptador universal para UE, Reino Unido, EE. UU., Canadá, Australia y 150 países.",
      fr: "Adaptateur universel pour UE, Royaume-Uni, États-Unis, Canada, Australie et 150 pays.",
    },
    "/images/prod-03.webp",
    "https://amzn.to/3SMx5nF",
    ELETRONICA,
  ),
  product(
    4,
    {
      pt: "Sacos de vácuo de roupa com bomba",
      en: "Vacuum storage bags with pump",
      es: "Bolsas de vacío para ropa con bomba",
      fr: "Sacs de rangement sous vide avec pompe",
    },
    {
      pt: "10 sacos de vácuo (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Economize espaço para roupas, material PA+PE adequado para mudanças.",
      en: "10 vacuum bags (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Save space for clothes, PA+PE material suitable for moving.",
      es: "10 bolsas de vacío (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Ahorra espacio para la ropa, material PA+PE adecuado para mudanzas.",
      fr: "10 sacs sous vide (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Gagnez de la place pour les vêtements, matériau PA+PE adapté aux déménagements.",
    },
    "/images/prod-04.webp",
    "https://amzn.to/4d2wGUS",
    VIAGENS,
  ),
  product(
    5,
    {
      pt: "Packing Cubes de compressão",
      en: "Compression packing cubes",
      es: "Packing cubes de compresión",
      fr: "Cubes de rangement compressibles",
    },
    {
      pt: "Organizador de mala 8 peças, travel essentials, preto.",
      en: "8-piece suitcase organizer set, travel essentials, black.",
      es: "Organizador de maleta de 8 piezas, esenciales de viaje, negro.",
      fr: "Organisateur de valise 8 pièces, essentiels de voyage, noir.",
    },
    "/images/prod-05.webp",
    "https://amzn.to/4gSopEd",
    VIAGENS,
  ),
  product(
    6,
    {
      pt: "Porta-documentos para viagem",
      en: "Travel document holder",
      es: "Portadocumentos de viaje",
      fr: "Porte-documents de voyage",
    },
    {
      pt: "Carteira de passaporte familiar com proteção RFID.",
      en: "Family passport wallet with RFID protection.",
      es: "Cartera de pasaporte familiar con protección RFID.",
      fr: "Pochette passeport familiale avec protection RFID.",
    },
    "/images/prod-06.webp",
    "https://amzn.to/46K6db6",
    VIAGENS,
  ),
  product(
    7,
    {
      pt: "Garrafa de água dobrável, 500 ml",
      en: "Foldable water bottle, 500 ml",
      es: "Botella de agua plegable, 500 ml",
      fr: "Bouteille d'eau pliable, 500 ml",
    },
    {
      pt: "Livre de BPA, à prova de fugas, água portátil, para atividades ao ar livre, desportos, campismo e viagens, preto.",
      en: "BPA-free, leak-proof, portable water for outdoor activities, sports, camping and travel, black.",
      es: "Libre de BPA, a prueba de fugas, agua portátil para actividades al aire libre, deportes, camping y viajes, negro.",
      fr: "Sans BPA, étanche, eau portable pour activités de plein air, sport, camping et voyages, noir.",
    },
    "/images/prod-07.webp",
    "https://amzn.to/466FWDI",
    VIAGENS,
  ),
  product(
    8,
    {
      pt: "Estojo de viagem para homem e mulher",
      en: "Travel toiletry bag for men and women",
      es: "Neceser de viaje para hombre y mujer",
      fr: "Trousse de toilette de voyage homme et femme",
    },
    {
      pt: "3L e 8L — bolsa de higiene e cosméticos para artigos de toucador com alça pendente, estojo de maquilhagem e banho para viagens (até 10 compartimentos).",
      en: "3L and 8L — hygiene and cosmetics bag for toiletries with hanging strap, makeup and bath case for travel (up to 10 compartments).",
      es: "3L y 8L — bolsa de higiene y cosméticos para artículos de tocador con correa colgante, neceser de maquillaje y baño para viajes (hasta 10 compartimentos).",
      fr: "3L et 8L — sac d'hygiène et cosmétiques pour articles de toilette avec sangle, trousse de maquillage et bain pour voyages (jusqu'à 10 compartiments).",
    },
    "/images/prod-08.webp",
    "https://amzn.to/4zXFCVk",
    BELEZA,
  ),
  product(
    9,
    {
      pt: "Hayayu Mochila viagem",
      en: "Hayayu travel backpack",
      es: "Hayayu mochila de viaje",
      fr: "Hayayu sac à dos de voyage",
    },
    {
      pt: "Cabine de avião 40 x 30 x 20 cm, compartimento para computador de 14 polegadas, bagagem de mão 24 L, estilo casual com bolso anti-roubo e bolsos laterais.",
      en: "Airplane cabin size 40 x 30 x 20 cm, 14-inch laptop compartment, 24 L hand luggage, casual style with anti-theft pocket and side pockets.",
      es: "Cabina de avión 40 x 30 x 20 cm, compartimento para portátil de 14 pulgadas, equipaje de mano 24 L, estilo casual con bolsillo antirrobo y bolsillos laterales.",
      fr: "Format cabine 40 x 30 x 20 cm, compartiment pour ordinateur 14 pouces, bagage cabine 24 L, style décontracté avec poche antivol et poches latérales.",
    },
    "/images/prod-09.webp",
    "https://amzn.to/3SUqw2d",
    VIAGENS,
  ),
  product(
    10,
    {
      pt: "Alarme pessoal de emergência com localizador",
      en: "Personal emergency alarm with tracker",
      es: "Alarma personal de emergencia con localizador",
      fr: "Alarme personnelle d'urgence avec localisateur",
    },
    {
      pt: "Qoosea 130 dB, 2 modos de luz, porta-chaves com carregamento USB, tracker de autodefesa pessoal para mulheres, estudantes e idosos.",
      en: "Qoosea 130 dB, 2 light modes, keychain alarm with USB charging, personal self-defence tracker for women, students and seniors.",
      es: "Qoosea 130 dB, 2 modos de luz, llavero con carga USB, rastreador de autodefensa personal para mujeres, estudiantes y personas mayores.",
      fr: "Qoosea 130 dB, 2 modes lumineux, porte-clés avec recharge USB, traqueur d'autodéfense pour femmes, étudiants et seniors.",
    },
    "/images/prod-10.webp",
    "https://amzn.to/4xAVOua",
    ELETRONICA,
  ),
  product(
    11,
    {
      pt: "Bolsa de cintura",
      en: "Hidden money belt",
      es: "Riñonera oculta",
      fr: "Ceinture cachée",
    },
    {
      pt: "Conjunto de 3 cintos ocultos, mala de viagem, cinto anti-roubo, cinto desportivo, ajustáveis, para homens e mulheres, viagens e corrida.",
      en: "Set of 3 hidden belts, travel bag, anti-theft belt, sports belt, adjustable for men and women, travel and running.",
      es: "Conjunto de 3 cinturones ocultos, bolso de viaje, cinturón antirrobo, cinturón deportivo, ajustables, para hombres y mujeres, viajes y running.",
      fr: "Lot de 3 ceintures discrètes, sacoche de voyage, ceinture antivol, ceinture sport, réglables, pour hommes et femmes, voyages et course.",
    },
    "/images/prod-11.webp",
    "https://amzn.to/4iKAmhK",
    VIAGENS,
  ),
  product(
    12,
    {
      pt: "Xiaomi 67W Power Bank",
      en: "Xiaomi 67W Power Bank",
      es: "Xiaomi 67W Power Bank",
      fr: "Xiaomi 67W Power Bank",
    },
    {
      pt: "20000 mAh com cabo USB-C integrado, azul gelo. Carregamento rápido 67 W, carregamento bidirecional — alimenta 3 dispositivos ao mesmo tempo.",
      en: "20000 mAh with built-in USB-C cable, ice blue. 67 W fast charging, bidirectional charging — powers 3 devices at the same time.",
      es: "20000 mAh con cable USB-C integrado, azul hielo. Carga rápida 67 W, carga bidireccional: alimenta 3 dispositivos a la vez.",
      fr: "20000 mAh avec câble USB-C intégré, bleu glacé. Charge rapide 67 W, charge bidirectionnelle : alimente 3 appareils à la fois.",
    },
    "/images/prod-12.webp",
    "https://amzn.to/4gEFItw",
    ELETRONICA,
  ),
];
