import { Category } from './types';

export const WORD_PACKS: Record<Exclude<Category, 'Personalizada'>, string[]> = {
  Comida: [
    // (40) originales
    "Pizza", "Sushi", "Paella", "Burger", "Tacos", "Ramen", "Pasta", "Ensalada", "Tarta", "Helado",
    "Croqueta", "Jamón", "Gazpacho", "Lentejas", "Burrito", "Curry", "Falafel", "Kebab", "Ceviche", "Dim Sum",
    "Lasaña", "Risotto", "Gnocchi", "Tortilla", "Churros", "Bacalao", "Pulpo", "Fabada", "Salmorejo", "Entrecot",
    "Solomillo", "Salmón", "Atún", "Gambas", "Langosta", "Mejillones", "Almejas", "Queso", "Yogur", "Flan",
    "Patatas", "Patatas Fritas", "Patatas Bravas", "Tortilla Francesa", "Filete", "Albóndigas", "Croquetas", "Arroz con Pollo", "Arroz Blanco", "Arroz Frito",
    "Lasaña", "Canelones", "Pizza Margarita", "Pizza Pepperoni", "Pasta Carbonara", "Pasta Boloñesa", "Salsa de Tomate", "Salsa Pesto", "Pasta con Queso", "Sopa de Pollo",
    "Ensalada César", "Ensalada Mixta", "Gazpacho", "Salmorejo", "Cocido", "Fabada", "Paella Mixta", "Tortilla de Patatas", "Calamares", "Gambas",
    "Salmón", "Atún", "Merluza", "Pollo Asado", "Pollo a la Plancha", "Kebab", "Falafel", "Perrito Caliente", "Tostada", "Pan con Tomate",
    "Jamón Serrano", "Chorizo", "Morcilla", "Queso Manchego", "Queso Fresco", "Yogur Natural", "Yogur de Fresa", "Natillas", "Arroz con Leche", "Bizcocho",
    "Galletas", "Magdalena", "Brownie", "Chocolate", "Churros con Chocolate", "Donut", "Croissant", "Crepe", "Gofre", "Mermelada",
    "Miel", "Café", "Café con Leche", "Té", "Cola", "Zumo", "Batido", "Agua", "Limonada", "Horchata",

    // Frutas y verduras súper comunes (también ayudan al juego)
    "Manzana", "Plátano", "Naranja", "Fresa", "Uva", "Melón", "Sandía", "Pera", "Piña", "Mango",
    "Limón", "Kiwi", "Cereza", "Melocotón", "Albaricoque", "Ciruela", "Granada", "Mandarina", "Higo", "Frambuesa",
    "Tomate", "Lechuga", "Zanahoria", "Patata", "Cebolla", "Ajo", "Pimiento", "Pepino", "Maíz", "Guisantes",
    "Lentejas", "Garbanzos", "Judías", "Champiñones", "Setas", "Brócoli", "Coliflor", "Espinacas", "Calabacín", "Berenjena",

    // Snacks y cosas de diario
    "Palomitas", "Patatas Chips", "Frutos Secos", "Pipas", "Aceitunas", "Tostitos", "Quesitos", "Yogur", "Cacao", "Caramelo",
    "Chicle", "Helado de Vainilla", "Helado de Chocolate", "Sorbete", "Granizado", "Polo", "Gominolas", "Chupa Chups", "Turrón", "Roscón"
  ],
   
  Lugares: [
    // (40) originales
    "París", "Tokio", "Playa", "Selva", "Marte", "Nueva York", "Londres", "Roma", "Desierto", "Montaña",
    "Polo Norte", "Cine", "Museo", "Estadio", "Hospital", "Escuela", "Aeropuerto", "Estación", "Bosque", "Castillo",
    "Luna", "Venecia", "Egipto", "Gran Muralla", "Torre Eiffel", "Coliseo", "Piscina", "Gimnasio", "Biblioteca", "Zoo",
    "Iglesia", "Supermercado", "Banco", "Restaurante", "Hotel", "Barco", "Avión", "Submarino", "Granja", "Fábrica",

    // +120 (x4 total = 160) — NO solo geográficos
    "Teatro", "Parque", "Plaza", "Cafetería", "Discoteca", "Azotea", "Mirador", "Carretera", "Túnel", "Puente",
    "Cueva", "Acantilado", "Isla", "Volcán", "Glaciar", "Río", "Lago", "Cascada", "Pantano", "Cañón",
    "Selva Tropical", "Pradera", "Sabana", "Jungla", "Valle", "Cima", "Refugio", "Camping", "Caravana", "Autopista",
    "Puerto", "Muelle", "Faro", "Mercado", "Centro Comercial", "Tienda", "Lavandería", "Farmacia", "Clínica", "Consultorio",

    "Laboratorio", "Oficina", "Coworking", "Sala de Reuniones", "Ascensor", "Pasillo", "Sótano", "Ático", "Terraza", "Jardín",
    "Invernadero", "Huerto", "Aula", "Patio", "Biblioteca Pública", "Sala de Espera", "Quirófano", "Ambulancia", "Comisaría", "Juzgado",
    "Tribunal", "Ayuntamiento", "Embajada", "Consulado", "Estudio", "Plató", "Backstage", "Camerino", "Cocina", "Comedor",
    "Trastero", "Garaje", "Taller", "Gasolinera", "Peaje", "Parada de Autobús", "Andén", "Vagón", "Metro", "Tranvía",

    "Santiago", "Lisboa", "Berlín", "Ámsterdam", "Praga", "Viena", "Budapest", "Atenas", "Estambul", "Dubái",
    "Marrakech", "El Cairo", "Johannesburgo", "Ciudad del Cabo", "Río de Janeiro", "Buenos Aires", "Lima", "Bogotá", "Ciudad de México", "La Habana",
    "Miami", "Los Ángeles", "San Francisco", "Chicago", "Toronto", "Montreal", "Vancouver", "Sídney", "Melbourne", "Bangkok",
    "Singapur", "Hong Kong", "Seúl", "Kioto", "Osaka", "Hawái", "Alpes", "Amazonas", "Antártida", "Saturno", "Parque Infantil", "Parque de Atracciones", "Feria", "Circo", "Acuario", "Planetario", "Bolera", "Pista de Hielo", "Skatepark", "Cancha",
    "Campo de Fútbol", "Pabellón", "Polideportivo", "Playa Urbana", "Paseo Marítimo", "Malecón", "Puerto Deportivo", "Rampa", "Mirador Nocturno", "Mirador del Río",
    "Mirador de Montaña", "Sendero", "Ruta", "Puente Colgante", "Paso de Cebra", "Rotonda", "Semáforo", "Aparcamiento", "Parking Subterráneo", "Aparcamiento de Bicis",
    "Callejón", "Barrio", "Casco Antiguo", "Centro", "Plaza del Pueblo", "Parque Central", "Jardín Botánico", "Rastro", "Mercadillo", "Tienda de Ropa",
    "Zapatería", "Juguetería", "Librería", "Papelería", "Panadería", "Carnicería", "Pescadería", "Frutería", "Tienda de Móviles", "Tienda de Deportes",
    "Tienda de Música", "Estanco", "Kiosco", "Bar", "Bar de Tapas", "Pizzería", "Hamburguesería", "Heladería", "Pastelería", "Churrería",
    "Casa", "Piso", "Apartamento", "Chalet", "Portal", "Escalera", "Recepción", "Vestíbulo", "Pasillo del Hotel", "Habitación",
    "Baño", "Ducha", "Cocina de Casa", "Salón", "Comedor de Casa", "Balcony", "Terraza de Bar", "Patio Interior", "Trastero", "Azotea del Edificio",
    "Gimnasio del Barrio", "Piscina Municipal", "Playa Artificial", "Camping Familiar", "Hostal", "Albergue", "Camping de Montaña", "Mirador del Castillo", "Muralla", "Monumento",
    "Oficina de Correos", "Biblioteca Escolar", "Sala de Juegos", "Sala de Cine", "Sala VIP", "Sala de Conciertos", "Escenario", "Camerino", "Backstage", "Cabina",
    "Taller Mecánico", "Lavadero", "Estación de Servicio", "Autovía", "Carretera Secundaria", "Vía de Tren", "Estación de Metro", "Parada de Taxi", "Parada de Bus", "Aeropuerto Internacional"
  ],

  Profesiones: [
    // (40) originales
    "Médico", "Astronauta", "Chef", "Bombero", "Policía", "Profesor", "Abogado", "Ingeniero", "Artista", "Músico",
    "Veterinario", "Dentista", "Arquitecto", "Periodista", "Fotógrafo", "Actor", "Científico", "Piloto", "Marinero", "Granjero",
    "Peluquero", "Carpintero", "Electricista", "Fontanero", "Panadero", "Carnicero", "Escritor", "Pintor", "Jardinero", "Buzo",
    "Psicólogo", "Contable", "Diseñador", "Programador", "Cajero", "Camarero", "Cartero", "Bibliotecario", "Enfermero", "Juez",

    // +120 (x4 total = 160)
    "Farmacéutico", "Fisioterapeuta", "Nutricionista", "Matrona", "Paramédico", "Cirujano", "Anestesista", "Radiólogo", "Oftalmólogo", "Pediatra",
    "Psiquiatra", "Terapeuta", "Entrenador", "Árbitro", "Socorrista", "Guía Turístico", "Recepcionista", "Conserje", "Vigilante", "Detective",
    "Soldado", "Marinero Mercante", "Capitán", "Azafato", "Controlador Aéreo", "Maquinista", "Conductor", "Taxista", "Camionero", "Mensajero",
    "Repartidor", "Logista", "Almacenero", "Operario", "Mecánico", "Chapista", "Electricista Industrial", "Montador", "Soldador", "Albañil",

    "Yesero", "Cristalero", "Cerrajero", "Tapicero", "Ebanista", "Herrero", "Joyero", "Relojero", "Sastre", "Zapatero",
    "Costurero", "Diseñador Gráfico", "Ilustrador", "Animador", "Editor", "Guionista", "Director", "Productor", "Creador de Contenido", "Streamer",
    "Community Manager", "Marketing", "Publicista", "Vendedor", "Comercial", "Atención al Cliente", "Teleoperador", "RRHH", "Reclutador", "Coach",
    "Consultor", "Analista", "Data Scientist", "QA Tester", "DevOps", "Diseñador UX", "Product Manager", "Scrum Master", "Administrador", "Contable Junior",

    "Economista", "Financiero", "Banquero", "Corredor", "Inversor", "Agente Inmobiliario", "Tasador", "Notario", "Registrador", "Traductor",
    "Intérprete", "Profesor de Idiomas", "Biólogo", "Químico", "Físico", "Geólogo", "Meteorólogo", "Oceanógrafo", "Arqueólogo", "Historiador",
    "Antropólogo", "Sociólogo", "Filósofo", "Sacerdote", "Pastor", "Imán", "Monje", "Pastelero", "Barista", "Sumiller"
  ],

  Objetos: [
    // (40) originales
    "Reloj", "Paraguas", "Guitarra", "Martillo", "Tijeras", "Espejo", "Cámara", "Teléfono", "Ordenador", "Libro",
    "Llave", "Mochila", "Silla", "Mesa", "Lámpara", "Gafas", "Botella", "Bicicleta", "Pelota", "Cuchara",
    "Tenedor", "Cuchillo", "Plato", "Vaso", "Cuaderno", "Lápiz", "Bolígrafo", "Mando", "Televisión", "Radio",
    "Violín", "Piano", "Trompeta", "Flauta", "Escoba", "Cepillo", "Jabón", "Toalla", "Cama", "Sofá",

    // +120 (x4 total = 160)
    "Auriculares", "Altavoz", "Micrófono", "Teclado", "Ratón", "Pantalla", "Tablet", "Cargador", "Powerbank", "Cable",
    "Router", "Impresora", "Escáner", "Disco Duro", "USB", "Drone", "Consola", "Mandos", "Casco", "Gorra",
    "Chaqueta", "Abrigo", "Sudadera", "Camiseta", "Pantalón", "Zapatos", "Zapatillas", "Calcetines", "Guantes", "Bufanda",
    "Anillo", "Pulsera", "Collar", "Pendientes", "Reloj Inteligente", "Billetera", "Monedero", "Tarjeta", "Billete", "Moneda",

    "Manta", "Almohada", "Sábana", "Colchón", "Cortina", "Persiana", "Alfombra", "Cojín", "Percha", "Armario",
    "Cajón", "Estantería", "Maceta", "Florero", "Jarrón", "Planta", "Regadera", "Pala", "Rastrillo", "Destornillador",
    "Alicate", "Llave Inglesa", "Taladro", "Tornillo", "Tuerca", "Clavo", "Cinta Métrica", "Nivel", "Linterna", "Pila",
    "Velas", "Encendedor", "Mechero", "Cenicero", "Sartén", "Olla", "Cazo", "Espátula", "Batidor", "Colador",

    "Tetera", "Cafetera", "Tostadora", "Microondas", "Horno", "Nevera", "Congelador", "Lavadora", "Secadora", "Plancha",
    "Aspiradora", "Ventilador", "Calefactor", "Aire Acondicionado", "Manguera", "Cubeta", "Fregona", "Bayeta", "Detergente", "Champú",
    "Pasta de Dientes", "Cepillo de Dientes", "Peine", "Pinza", "Taza", "Termo", "Cantimplora", "Llave de Coche", "Cochecito", "Carrito", "Papel", "Cartón", "Tijera", "Pegamento", "Cinta", "Celo", "Regla", "Goma", "Sacapuntas", "Rotulador",
    "Subrayador", "Carpeta", "Archivador", "Grapadora", "Grapas", "Clip", "Post-it", "Agenda", "Calendario", "Sobre",
    "Carta", "Sello", "Móvil", "Funda", "Cristal Templado", "Mando a Distancia", "Pila", "Bombilla", "Enchufe", "Ladrón",
    "Alargador", "Ventana", "Puerta", "Pomo", "Cerradura", "Candado", "Cadena", "Cuerda", "Cinta Métrica", "Escalera",
    "Martillo de Goma", "Sierra", "Brocha", "Rodillo", "Pintura", "Cubeta", "Guantes de Látex", "Mascarilla", "Gafas de Sol", "Gafas de Lectura",
    "Sombrero", "Gorro", "Cinturón", "Corbata", "Pañuelo", "Maleta", "Neceser", "Toallitas", "Papel Higiénico", "Pañuelos",
    "Esponja", "Estropajo", "Fregasuelos", "Desinfectante", "Lejía", "Ambientador", "Perfume", "Crema", "Protector Solar", "Desodorante",
    "Maquinilla", "Secador", "Plancha de Pelo", "Espejo de Mano", "Peine", "Cepillo", "Pinzas", "Tijeras de Uñas", "Cortaúñas", "Colonia",
    "Manta", "Cojín", "Edredón", "Sábana Bajera", "Percha", "Cesto", "Cubo", "Palangana", "Jarra", "Cuchillo de Cocina",
    "Tabla", "Servilleta", "Mantel", "Tupper", "Fiambrera", "Pajita", "Abrelatas", "Sacacorchos", "Tapón", "Imán"
  ],

  Deportes: [
    // (30) originales
    "Fútbol", "Tenis", "Surf", "Boxeo", "Baloncesto", "Natación", "Ciclismo", "Atletismo", "Golf", "Voleibol",
    "Rugby", "Béisbol", "Hockey", "Esquí", "Snowboard", "Patinaje", "Escalada", "Kárate", "Judo", "Yoga",
    "Pádel", "Ping Pong", "Danza", "Esgrima", "Remo", "Vela", "Piragüismo", "Tiro con Arco", "Equitación", "Senderismo",

    // +90 (x4 total = 120)
    "Balonmano", "Futsal", "Bádminton", "Squash", "Críquet", "Fórmula 1", "Motocross", "Karting", "Rally", "Automovilismo",
    "Triatlón", "Pentatlón", "Gimnasia", "Gimnasia Rítmica", "Halterofilia", "Powerlifting", "Crossfit", "Calistenia", "Parkour", "Skate",
    "Longboard", "BMX", "Patinaje Artístico", "Patinaje de Velocidad", "Escalada Deportiva", "Montañismo", "Orientación", "Trail Running", "Maratón", "Ultramaratón",
    "Kickboxing", "Muay Thai", "Taekwondo", "Aikido", "Lucha Libre", "Lucha Grecorromana", "MMA", "Karate", "Jiu-jitsu", "Capoeira",
    "Waterpolo", "Buceo", "Apnea", "Windsurf", "Kitesurf", "Bodyboard", "Vela Ligera", "Pesca Deportiva", "Rafting", "Kayak",
    "Canoa", "Esquí de Fondo", "Biathlón", "Curling", "Trineo", "Bobsleigh", "Luge", "Snowkite", "Esquí Acuático", "Wakeboard",
    "Softbol", "Lacrosse", "Fútbol Americano", "Canadiense", "Ultimate Frisbee", "Frisbee", "Petanca", "Bolos", "Dardos", "Ajedrez",
    "E-sports", "Ciclismo de Pista", "Ciclismo de Montaña", "Downhill", "Enduro", "Polo", "Hípica", "Tiro Deportivo", "Airsoft", "Paintball"
  ],

  España: [
    // (30) originales
    "Tortilla de Patatas", "Ibiza", "El Quijote", "Flamenco", "Sagrada Familia", "Alhambra", "San Fermín", "La Tomatina", "Real Madrid", "Barça",
    "Sevilla", "Madrid", "Barcelona", "Valencia", "Bilbao", "Granada", "Sidra", "Tapas", "Siesta", "Fiesta",
    "Playas", "Pueblos Blancos", "Camino de Santiago", "Lorca", "Dalí", "Picasso", "Rafa Nadal", "Fernando Alonso", "Serrano", "Paella",

    // +90 (x4 total = 120)
    "Cocido", "Gazpacho", "Salmorejo", "Jamón Ibérico", "Churros", "Bocadillo", "Cañas", "Vermú", "Turrón", "Roscos",
    "Reyes Magos", "Semana Santa", "Feria", "Romería", "Fallás", "Castellers", "Jota", "Sardana", "Cante", "Guitarra Española",
    "Plaza Mayor", "Puerta del Sol", "Gran Vía", "Retiro", "Prado", "Reina Sofía", "Guggenheim", "Mezquita de Córdoba", "Catedral", "Acueducto",
    "Toledo", "Salamanca", "Zaragoza", "Málaga", "Cádiz", "Alicante", "Murcia", "Vigo", "A Coruña", "San Sebastián",
    "Santander", "Gijón", "Oviedo", "Pamplona", "Logroño", "Burgos", "León", "Segovia", "Ávila", "Cuenca",

    "Rías", "Picos de Europa", "Sierra Nevada", "Doñana", "Teide", "Mallorca", "Menorca", "Canarias", "Tenerife", "Lanzarote",
    "Costa Brava", "Costa del Sol", "Costa Blanca", "Mar Cantábrico", "Mediterráneo", "Pa amb Tomàquet", "Calçots", "Pulpo a la Gallega", "Fabada", "Fideuá",
    "Horchata", "Buñuelos", "Pisto", "Migas", "Tortas", "Serranito", "Gazpachuelo", "Carajillo", "Café con Leche", "Chocolatería",
    "Carmen", "Lola Flores", "Paco de Lucía", "Penélope Cruz", "Antonio Banderas", "Santiago Segura", "Rosalía", "Javier Bardem", "Piqué", "Iniesta"
  ],

  Famosos: [
    // (30) originales
    "Lionel Messi", "Cristiano Ronaldo", "Beyoncé", "Elon Musk", "Albert Einstein", "Michael Jackson", "Shakira", "Donald Trump", "Brad Pitt", "Angelina Jolie",
    "Taylor Swift", "Bad Bunny", "Rosalía", "Ibai Llanos", "Auronplay", "TheGrefg", "Will Smith", "Leonardo DiCaprio", "Johnny Depp", "Tom Cruise",
    "Rihanna", "Ariana Grande", "Justin Bieber", "Dua Lipa", "Miley Cyrus", "Lady Gaga", "Drake", "Eminem", "Kanye West", "Bill Gates",

    // +90 (x4 total = 120)
    "Barack Obama", "Oprah Winfrey", "Denzel Washington", "Scarlett Johansson", "Natalie Portman", "Jennifer Lawrence", "Emma Stone", "Keanu Reeves", "Robert Downey Jr.", "Chris Hemsworth",
    "Chris Evans", "Ryan Reynolds", "Hugh Jackman", "Mark Ruffalo", "Anne Hathaway", "Nicole Kidman", "Charlize Theron", "Meryl Streep", "Morgan Freeman", "Samuel L. Jackson",
    "Zendaya", "Timothée Chalamet", "Margot Robbie", "Cillian Murphy", "Joaquin Phoenix", "Javier Bardem", "Penélope Cruz", "Antonio Banderas", "Pedro Pascal", "Gael García Bernal",

    "Selena Gomez", "Katy Perry", "Sia", "Adele", "Ed Sheeran", "Harry Styles", "The Weeknd", "Post Malone", "Doja Cat", "Nicki Minaj",
    "Travis Scott", "J Balvin", "Karol G", "Daddy Yankee", "Luis Fonsi", "Maluma", "Anuel AA", "Ozuna", "Rauw Alejandro", "Nicky Jam",
    "Bizarrap", "Duki", "Quevedo", "Feid", "Myke Towers", "Pablo Alborán", "Alejandro Sanz", "David Bisbal", "Enrique Iglesias", "Julio Iglesias",

    "Mark Zuckerberg", "Jeff Bezos", "Steve Jobs", "Tim Cook", "Satya Nadella", "Sundar Pichai", "Warren Buffett", "Elon Musk", "Serena Williams", "Roger Federer",
    "Rafa Nadal", "Novak Djokovic", "Lewis Hamilton", "Max Verstappen", "Fernando Alonso", "Kylian Mbappé", "Erling Haaland", "Neymar", "Ronaldinho", "Zinedine Zidane",
    "Stephen Curry", "LeBron James", "Michael Jordan", "Kobe Bryant", "Usain Bolt", "Michael Phelps", "Simone Biles", "Naomi Osaka", "Conor McGregor", "Mike Tyson"
  ],

  Random: [] // Will be populated by mixing all above
};

WORD_PACKS.Random = [
  ...WORD_PACKS.Comida,
  ...WORD_PACKS.Lugares,
  ...WORD_PACKS.Profesiones,
  ...WORD_PACKS.Objetos,
  ...WORD_PACKS.Deportes,
  ...WORD_PACKS.Famosos,
  ...WORD_PACKS.España
];

export const CATEGORY_METADATA: Record<Category, { color: string, iconName: string }> = {
  Comida: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Utensils' },
  Lugares: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'MapPin' },
  Profesiones: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Briefcase' },
  Objetos: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Package' },
  Deportes: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Dribbble' },
  Famosos: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Star' },
  España: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Flag' },
  Random: { color: 'from-[#FE70C8] to-[#FD9FD9]', iconName: 'Shuffle' },
  Personalizada: { color: 'from-[#5F5E5E] to-[#0B0B0B]', iconName: 'Pencil' }
};
