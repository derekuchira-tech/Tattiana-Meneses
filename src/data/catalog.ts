import type { Catalog } from "@app/lib/catalog";

// Static catalog bundled with the site: recommendations render for every
// visitor without any server, database or credentials.

const AMAZON = "50000000-0000-4000-8000-000000000001";
const VIAGENS = "c0000000-0000-4000-8000-000000000001";
const ELETRONICA = "c0000000-0000-4000-8000-000000000002";
const BELEZA = "c0000000-0000-4000-8000-000000000003";
const CREATED_AT = "2026-09-27T00:00:00.000Z";

export const staticCatalog: Catalog = {
  categories: [
    { id: VIAGENS, slug: "viagens", names: { pt: "Viagens", en: "Travel", es: "Viajes", fr: "Voyages" }, sort_order: 1 },
    { id: ELETRONICA, slug: "eletronica", names: { pt: "Eletrónica", en: "Electronics", es: "Electrónica", fr: "Électronique" }, sort_order: 2 },
    { id: BELEZA, slug: "beleza", names: { pt: "Beleza & Higiene", en: "Beauty & Care", es: "Belleza & Higiene", fr: "Beauté & Hygiène" }, sort_order: 3 },
  ],
  stores: [{ id: AMAZON, slug: "amazon", name: "Amazon", sort_order: 1 }],
  products: [
    {
      id: "90000000-0000-4000-8000-000000000001", sort_order: 1, active: true, created_at: CREATED_AT,
      names: { pt: "Balança malas de viagem portátil", en: "Portable luggage scale", es: "Báscula portátil para maletas", fr: "Balance portable pour bagages" },
      descriptions: {
        pt: "Balança de bagagem com ecrã LCD, até 110 lb/50 kg, para viagens ao ar livre, cinzento.",
        en: "Luggage scale with LCD screen, up to 110 lb/50 kg, for outdoor travel, grey.",
        es: "Báscula de equipaje con pantalla LCD, hasta 110 lb/50 kg, para viajes al aire libre, gris.",
        fr: "Balance à bagages avec écran LCD, jusqu'à 110 lb/50 kg, pour les voyages en plein air, gris.",
      },
      button_texts: {}, image_url: "/images/prod-01.webp", affiliate_url: "https://amzn.to/4csNFQa",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000002", sort_order: 2, active: true, created_at: CREATED_AT,
      names: { pt: "Almofada de viagem insuflável", en: "Inflatable travel pillow", es: "Almohada de viaje inflable", fr: "Oreiller de voyage gonflable" },
      descriptions: {
        pt: "Almofada cervical para poupar espaço em malas em viagens de avião, comboio ou carro.",
        en: "Neck pillow that saves suitcase space on plane, train or car trips.",
        es: "Almohada cervical para ahorrar espacio en la maleta en viajes de avión, tren o coche.",
        fr: "Oreiller cervical pour gagner de la place dans la valise en avion, train ou voiture.",
      },
      button_texts: {}, image_url: "/images/prod-02.webp", affiliate_url: "https://amzn.to/4cZLzaw",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000003", sort_order: 3, active: true, created_at: CREATED_AT,
      names: { pt: "Adaptador de tomada universal", en: "Universal travel adapter", es: "Adaptador de enchufe universal", fr: "Adaptateur de prise universel" },
      descriptions: {
        pt: "Adaptador universal para UE, Reino Unido, americano, Canadá, Austrália e 150 países.",
        en: "Universal adapter for EU, UK, US, Canada, Australia and 150 countries.",
        es: "Adaptador universal para UE, Reino Unido, EE. UU., Canadá, Australia y 150 países.",
        fr: "Adaptateur universel pour UE, Royaume-Uni, États-Unis, Canada, Australie et 150 pays.",
      },
      button_texts: {}, image_url: "/images/prod-03.webp", affiliate_url: "https://amzn.to/3SMx5nF",
      category_id: ELETRONICA, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000004", sort_order: 4, active: true, created_at: CREATED_AT,
      names: { pt: "Sacos de vácuo de roupa com bomba", en: "Vacuum storage bags with pump", es: "Bolsas de vacío para ropa con bomba", fr: "Sacs de rangement sous vide avec pompe" },
      descriptions: {
        pt: "10 sacos de vácuo (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Economize espaço para roupas, material PA+PE adequado para mudanças.",
        en: "10 vacuum bags (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Save space for clothes, PA+PE material suitable for moving.",
        es: "10 bolsas de vacío (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Ahorra espacio para la ropa, material PA+PE adecuado para mudanzas.",
        fr: "10 sacs sous vide (4 L 80 x 60 cm, 3 M 70 x 50 cm, 3 S 60 x 40 cm). Gagnez de la place pour les vêtements, matériau PA+PE adapté aux déménagements.",
      },
      button_texts: {}, image_url: "/images/prod-04.webp", affiliate_url: "https://amzn.to/4d2wGUS",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000005", sort_order: 5, active: true, created_at: CREATED_AT,
      names: { pt: "Packing Cubes de compressão", en: "Compression packing cubes", es: "Packing cubes de compresión", fr: "Cubes de rangement compressibles" },
      descriptions: {
        pt: "Organizador de mala 8 peças, travel essentials, preto.",
        en: "8-piece suitcase organizer set, travel essentials, black.",
        es: "Organizador de maleta de 8 piezas, esenciales de viaje, negro.",
        fr: "Organisateur de valise 8 pièces, essentiels de voyage, noir.",
      },
      button_texts: {}, image_url: "/images/prod-05.webp", affiliate_url: "https://amzn.to/4gSopEd",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000006", sort_order: 6, active: true, created_at: CREATED_AT,
      names: { pt: "Porta-documentos para viagem", en: "Travel document holder", es: "Portadocumentos de viaje", fr: "Porte-documents de voyage" },
      descriptions: {
        pt: "Carteira de passaporte familiar com proteção RFID.",
        en: "Family passport wallet with RFID protection.",
        es: "Cartera de pasaporte familiar con protección RFID.",
        fr: "Pochette passeport familiale avec protection RFID.",
      },
      button_texts: {}, image_url: "/images/prod-06.webp", affiliate_url: "https://amzn.to/46K6db6",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000007", sort_order: 7, active: true, created_at: CREATED_AT,
      names: { pt: "Garrafa de água dobrável, 500 ml", en: "Foldable water bottle, 500 ml", es: "Botella de agua plegable, 500 ml", fr: "Bouteille d'eau pliable, 500 ml" },
      descriptions: {
        pt: "Livre de BPA, à prova de fugas, água portátil, para atividades ao ar livre, desportos, campismo e viagens, preto.",
        en: "BPA-free, leak-proof, portable water for outdoor activities, sports, camping and travel, black.",
        es: "Libre de BPA, a prueba de fugas, agua portátil para actividades al aire libre, deportes, camping y viajes, negro.",
        fr: "Sans BPA, étanche, eau portable pour activités de plein air, sport, camping et voyages, noir.",
      },
      button_texts: {}, image_url: "/images/prod-07.webp", affiliate_url: "https://amzn.to/466FWDI",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000008", sort_order: 8, active: true, created_at: CREATED_AT,
      names: { pt: "Estojo de viagem para homem e mulher", en: "Travel toiletry bag for men and women", es: "Neceser de viaje para hombre y mujer", fr: "Trousse de toilette de voyage homme et femme" },
      descriptions: {
        pt: "3L e 8L — bolsa de higiene e cosméticos para artigos de toucador com alça pendente, estojo de maquilhagem e banho para viagens (até 10 compartimentos).",
        en: "3L and 8L — hygiene and cosmetics bag for toiletries with hanging strap, makeup and bath case for travel (up to 10 compartments).",
        es: "3L y 8L — bolsa de higiene y cosméticos para artículos de tocador con correa colgante, neceser de maquillaje y baño para viajes (hasta 10 compartimentos).",
        fr: "3L et 8L — sac d'hygiène et cosmétiques pour articles de toilette avec sangle, trousse de maquillage et bain pour voyages (jusqu'à 10 compartiments).",
      },
      button_texts: {}, image_url: "/images/prod-08.webp", affiliate_url: "https://amzn.to/4zXFCVk",
      category_id: BELEZA, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000009", sort_order: 9, active: true, created_at: CREATED_AT,
      names: { pt: "Hayayu Mochila viagem", en: "Hayayu travel backpack", es: "Hayayu mochila de viaje", fr: "Hayayu sac à dos de voyage" },
      descriptions: {
        pt: "Cabine de avião 40 x 30 x 20 cm, compartimento para computador de 14 polegadas, bagagem de mão 24 L, estilo casual com bolso anti-roubo e bolsos laterais.",
        en: "Airplane cabin size 40 x 30 x 20 cm, 14-inch laptop compartment, 24 L hand luggage, casual style with anti-theft pocket and side pockets.",
        es: "Cabina de avión 40 x 30 x 20 cm, compartimento para portátil de 14 pulgadas, equipaje de mano 24 L, estilo casual con bolsillo antirrobo y bolsillos laterales.",
        fr: "Format cabine 40 x 30 x 20 cm, compartiment pour ordinateur 14 pouces, bagage cabine 24 L, style décontracté avec poche antivol et poches latérales.",
      },
      button_texts: {}, image_url: "/images/prod-09.webp", affiliate_url: "https://amzn.to/3SUqw2d",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000010", sort_order: 10, active: true, created_at: CREATED_AT,
      names: { pt: "Alarme pessoal de emergência com localizador", en: "Personal emergency alarm with tracker", es: "Alarma personal de emergencia con localizador", fr: "Alarme personnelle d'urgence avec localisateur" },
      descriptions: {
        pt: "Qoosea 130 dB, 2 modos de luz, porta-chaves com carregamento USB, tracker de autodefesa pessoal para mulheres, estudantes e idosos.",
        en: "Qoosea 130 dB, 2 light modes, keychain alarm with USB charging, personal self-defence tracker for women, students and seniors.",
        es: "Qoosea 130 dB, 2 modos de luz, llavero con carga USB, rastreador de autodefensa personal para mujeres, estudiantes y personas mayores.",
        fr: "Qoosea 130 dB, 2 modes lumineux, porte-clés avec recharge USB, traqueur d'autodéfense pour femmes, étudiants et seniors.",
      },
      button_texts: {}, image_url: "/images/prod-10.webp", affiliate_url: "https://amzn.to/4xAVOua",
      category_id: ELETRONICA, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000011", sort_order: 11, active: true, created_at: CREATED_AT,
      names: { pt: "Bolsa de cintura", en: "Hidden money belt", es: "Riñonera oculta", fr: "Ceinture cachée" },
      descriptions: {
        pt: "Conjunto de 3 cintos ocultos, mala de viagem, cinto anti-roubo, cinto desportivo, ajustáveis, para homens e mulheres, viagens e corrida.",
        en: "Set of 3 hidden belts, travel bag, anti-theft belt, sports belt, adjustable for men and women, travel and running.",
        es: "Conjunto de 3 cinturones ocultos, bolso de viaje, cinturón antirrobo, cinturón deportivo, ajustables, para hombres y mujeres, viajes y running.",
        fr: "Lot de 3 ceintures discrètes, sacoche de voyage, ceinture antivol, ceinture sport, réglables, pour hommes et femmes, voyages et course.",
      },
      button_texts: {}, image_url: "/images/prod-11.webp", affiliate_url: "https://amzn.to/4iKAmhK",
      category_id: VIAGENS, store_id: AMAZON,
    },
    {
      id: "90000000-0000-4000-8000-000000000012", sort_order: 12, active: true, created_at: CREATED_AT,
      names: { pt: "Xiaomi 67W Power Bank", en: "Xiaomi 67W Power Bank", es: "Xiaomi 67W Power Bank", fr: "Xiaomi 67W Power Bank" },
      descriptions: {
        pt: "20000 mAh com cabo USB-C integrado, azul gelo. Carregamento rápido 67 W, carregamento bidirecional — alimenta 3 dispositivos ao mesmo tempo.",
        en: "20000 mAh with built-in USB-C cable, ice blue. 67 W fast charging, bidirectional charging — powers 3 devices at the same time.",
        es: "20000 mAh con cable USB-C integrado, azul hielo. Carga rápida 67 W, carga bidireccional: alimenta 3 dispositivos a la vez.",
        fr: "20000 mAh avec câble USB-C intégré, bleu glacé. Charge rapide 67 W, charge bidirectionnelle : alimente 3 appareils à la fois.",
      },
      button_texts: {}, image_url: "/images/prod-12.webp", affiliate_url: "https://amzn.to/4gEFItw",
      category_id: ELETRONICA, store_id: AMAZON,
    },
  ],
};
