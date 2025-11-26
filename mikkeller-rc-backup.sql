--
-- PostgreSQL database dump
--

\restrict 5ejffaVM1HBbcxBUtGU1xNkTVGfz7M7pUwzD5kxaHx3t2yYi42g4OEOHFQSCJ9J

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: event_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.event_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.event_status OWNER TO neondb_owner;

--
-- Name: event_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.event_type AS ENUM (
    'club',
    'irregular',
    'out_of_town',
    'city',
    'athletics',
    'croissant'
);


ALTER TYPE public.event_type OWNER TO neondb_owner;

--
-- Name: news_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.news_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.news_status OWNER TO neondb_owner;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.order_status AS ENUM (
    'created',
    'paid',
    'failed'
);


ALTER TYPE public.order_status OWNER TO neondb_owner;

--
-- Name: photo_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.photo_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.photo_status OWNER TO neondb_owner;

--
-- Name: role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.role AS ENUM (
    'USER',
    'EDITOR',
    'ADMIN'
);


ALTER TYPE public.role OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.about_settings (
    id character varying DEFAULT 'singleton'::character varying NOT NULL,
    hero_title text DEFAULT 'О Mikkeller Running Club'::text NOT NULL,
    hero_text_1 text DEFAULT 'Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене. Наша философия проста: бег должен быть доступен всем, независимо от уровня подготовки.'::text NOT NULL,
    hero_text_2 text DEFAULT 'Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров. После забега мы собираемся вместе, чтобы отметить достижения и насладиться компанией друг друга.'::text NOT NULL,
    hero_text_3 text DEFAULT 'В Москве клуб работает с 2016 года и объединяет более 1200 активных участников. Мы проводим еженедельные забеги в разных локациях города.'::text NOT NULL,
    stats_members text DEFAULT '1,200+'::text NOT NULL,
    stats_members_label text DEFAULT 'Участников в Москве'::text NOT NULL,
    stats_bars text DEFAULT '25+'::text NOT NULL,
    stats_bars_label text DEFAULT 'Баров-партнеров'::text NOT NULL,
    stats_runs text DEFAULT '500+'::text NOT NULL,
    stats_runs_label text DEFAULT 'Проведено забегов'::text NOT NULL,
    stats_distance text DEFAULT '15,000'::text NOT NULL,
    stats_distance_label text DEFAULT 'Километров пробежано'::text NOT NULL,
    rule_1_title text DEFAULT 'Все уровни приветствуются'::text NOT NULL,
    rule_1_text text DEFAULT 'Не важно, новичок вы или опытный бегун — каждый найдёт свой темп и группу единомышленников.'::text NOT NULL,
    rule_2_title text DEFAULT 'Никто не остаётся позади'::text NOT NULL,
    rule_2_text text DEFAULT 'Мы всегда бежим вместе. У нас есть группы разного темпа, чтобы всем было комфортно.'::text NOT NULL,
    rule_3_title text DEFAULT 'Безопасность превыше всего'::text NOT NULL,
    rule_3_text text DEFAULT 'Следуйте правилам дорожного движения, бегайте по правой стороне дороги, используйте светоотражающие элементы.'::text NOT NULL,
    rule_4_title text DEFAULT 'Уважение к другим'::text NOT NULL,
    rule_4_text text DEFAULT 'Мы уважаем всех участников, пешеходов и других пользователей дорог. Будьте вежливы и дружелюбны.'::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    hero_image_url text
);


ALTER TABLE public.about_settings OWNER TO neondb_owner;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activities (
    id bigint NOT NULL,
    user_id character varying NOT NULL,
    name text NOT NULL,
    distance real NOT NULL,
    moving_time integer NOT NULL,
    sport_type text NOT NULL,
    polyline text,
    start_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activities OWNER TO neondb_owner;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admins (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username character varying NOT NULL,
    password_hash text NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admins OWNER TO neondb_owner;

--
-- Name: event_routes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.event_routes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    event_id character varying NOT NULL,
    name text,
    distance_km real NOT NULL,
    gpx_url text,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.event_routes OWNER TO neondb_owner;

--
-- Name: events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.events (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    starts_at timestamp without time zone NOT NULL,
    ends_at timestamp without time zone,
    latitude real,
    longitude real,
    address text,
    distance_km real,
    gpx_url text,
    polyline text,
    cover_image_url text,
    status public.event_status DEFAULT 'draft'::public.event_status NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    event_type public.event_type DEFAULT 'club'::public.event_type,
    location_id character varying
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: home_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.home_settings (
    id character varying DEFAULT 'singleton'::character varying NOT NULL,
    hero_image_url text,
    hero_title text DEFAULT 'Mikkeller Running Club'::text NOT NULL,
    hero_subtitle text DEFAULT 'Мы бегаем. Мы пьём пиво. Мы друзья.'::text NOT NULL,
    about_title text DEFAULT 'О клубе'::text NOT NULL,
    about_text_1 text DEFAULT 'Mikkeller Running Club — это международное сообщество бегунов, которые встречаются каждую неделю, чтобы вместе бегать и наслаждаться компанией друг друга.'::text NOT NULL,
    about_text_2 text DEFAULT 'Мы бегаем в более чем 50 городах по всему миру. Наши забеги подходят для всех уровней подготовки — от новичков до опытных марафонцев.'::text NOT NULL,
    stats_participants text DEFAULT '1200+'::text NOT NULL,
    stats_cities text DEFAULT '50+'::text NOT NULL,
    stats_runs text DEFAULT '500+'::text NOT NULL,
    stats_kilometers text DEFAULT '15K'::text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.home_settings OWNER TO neondb_owner;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.locations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    address text NOT NULL,
    latitude real NOT NULL,
    longitude real NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    logo_url text
);


ALTER TABLE public.locations OWNER TO neondb_owner;

--
-- Name: news; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.news (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content text NOT NULL,
    cover_image_url text,
    published_at timestamp without time zone,
    status public.news_status DEFAULT 'draft'::public.news_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO neondb_owner;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    items jsonb NOT NULL,
    amount_total integer NOT NULL,
    currency text DEFAULT 'RUB'::text NOT NULL,
    status public.order_status DEFAULT 'created'::public.order_status NOT NULL,
    email text NOT NULL,
    shipping_address jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    yookassa_payment_id text
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: page_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.page_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    page_key character varying NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    keywords text,
    og_title text,
    og_description text,
    og_image_url text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.page_settings OWNER TO neondb_owner;

--
-- Name: photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.photos (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    event_id character varying,
    title text,
    description text,
    url text NOT NULL,
    thumb_url text NOT NULL,
    status public.photo_status DEFAULT 'pending'::public.photo_status NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    admin_id character varying
);


ALTER TABLE public.photos OWNER TO neondb_owner;

--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    category text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    base_price integer
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: strava_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.strava_accounts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    strava_id bigint NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    expires_at bigint NOT NULL,
    first_name text,
    last_name text,
    profile_picture text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.strava_accounts OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    role public.role DEFAULT 'USER'::public.role NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: variants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.variants (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    product_id character varying NOT NULL,
    size text,
    color text,
    sku text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    price integer NOT NULL
);


ALTER TABLE public.variants OWNER TO neondb_owner;

--
-- Data for Name: about_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.about_settings (id, hero_title, hero_text_1, hero_text_2, hero_text_3, stats_members, stats_members_label, stats_bars, stats_bars_label, stats_runs, stats_runs_label, stats_distance, stats_distance_label, rule_1_title, rule_1_text, rule_2_title, rule_2_text, rule_3_title, rule_3_text, rule_4_title, rule_4_text, updated_at, hero_image_url) FROM stdin;
singleton	О Mikkeller Running Club	Mikkeller Running Club — это международное беговое сообщество, основанное в 2014 году в Копенгагене. Наша философия проста: бег должен быть доступен всем, независимо от уровня подготовки.	Каждую неделю тысячи бегунов по всему миру выходят на улицы своих городов, чтобы пробежать вместе 5-10 километров. После забега мы собираемся вместе, чтобы отметить достижения и насладиться компанией друг друга.	В Санкт-Петербурге клуб работает с 2017 года и объединяет более 700 активных участников. Мы проводим еженедельные забеги в разных локациях города.	725+	Участников в Санкт-Петербурге	25+	Баров-партнеров	500+	Проведено забегов	15,000	Километров пробежано	Все уровни приветствуются	Не важно, новичок вы или опытный бегун — каждый найдёт свой темп и группу единомышленников.	Никто не остаётся позади	Мы всегда бежим вместе. У нас есть группы разного темпа, чтобы всем было комфортно.	Безопасность превыше всего	Следуйте правилам дорожного движения, бегайте по правой стороне дороги, используйте светоотражающие элементы.	Уважение к другим	Мы уважаем всех участников, пешеходов и других пользователей дорог. Будьте вежливы и дружелюбны.	2025-11-13 12:59:59.85	/uploads/about/IVlbkCweOAHo3kbMRiR6P.jpg
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activities (id, user_id, name, distance, moving_time, sport_type, polyline, start_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admins (id, username, password_hash, email, first_name, last_name, created_at) FROM stdin;
12b921ae-3850-4e80-9732-fe2871839ab9	admin	$2b$10$K/do2PChRNlZ53SR3KIX.eddcasbZHXq2421bLOvOpawKvpTNhA2y	admin@mrc.local	Admin	User	2025-11-12 18:49:41.175733
ed6ce624-38bb-4015-a3c2-427fa05afe41	xa3ro	$2b$10$.FgHr.GDDbjvg2I13zdNWOB8SsMlyWYV.P1xkcnFN53XqRqfQLAHy	9457130@gmail.com	Максим	Федосеев	2025-11-16 19:24:47.145216
\.


--
-- Data for Name: event_routes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.event_routes (id, event_id, name, distance_km, gpx_url, "order", created_at) FROM stdin;
75c71381-73f7-405a-8ccc-0a696896ed1c	301ae252-d0c9-4104-9a42-5dca92650a49	\N	7.46	/uploads/gpx/zrYkoV02p96_nUhtkqpVx.gpx	0	2025-11-13 12:07:34.815194
3b245ab8-487d-4756-8426-037f96e9552f	fee4bb62-9882-4c4b-b1bb-c9e409ccec08	5к	5.159	/uploads/gpx/dGwLM06e2NurezzTUwAEm.gpx	0	2025-11-13 12:26:37.24209
2e614a66-b01e-40d6-9308-63609c3a2818	fee4bb62-9882-4c4b-b1bb-c9e409ccec08	10к	10.454	/uploads/gpx/tAt6hanSps_RT1aBVBena.gpx	1	2025-11-13 12:26:38.013442
aef9b6ab-1789-448f-adb3-52ce7ddbe2f2	6e613146-eb24-4bb5-9f56-8e7bd784204c	21K	20.179	/uploads/gpx/6x0QhK72IKD5zeG0QmPv2.gpx	0	2025-11-13 13:31:24.453032
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.events (id, slug, title, description, starts_at, ends_at, latitude, longitude, address, distance_km, gpx_url, polyline, cover_image_url, status, tags, created_at, event_type, location_id) FROM stdin;
6e613146-eb24-4bb5-9f56-8e7bd784204c	athletics	Athletics	<p>Присоединяйтесь к пробежке спортивной ячейки Mikkeller: стартуем от культового Knightberg, держим дружелюбный темп и наслаждаемся атмосферой клуба. После пробега — общение и традиционный постран!</p>	2025-11-16 12:00:00	\N	\N	\N	\N	\N	\N	\N	/uploads/covers/k46dCTjOBw856oFOX1EUC.jpg	published	{}	2025-11-13 13:31:23.234228	athletics	b0a092ed-056a-439a-a162-a5d6a87d0908
301ae252-d0c9-4104-9a42-5dca92650a49	внештатный-22	Внештатный	<p>Лёгкий вечерний пробег по Васильевскому острову с стартом и финишем в баре «Стекло». Бежим в комфортном темпе, общаемся, наслаждаемся атмосферой.</p>	2025-11-13 17:00:00	\N	\N	\N	\N	7.46	/uploads/gpx/zrYkoV02p96_nUhtkqpVx.gpx	\N	/uploads/covers/8L-XkV2hEuPPxzrtHl4Sl.png	published	{}	2025-11-12 21:14:49.09671	irregular	9bbf6849-e6aa-4ebe-9b75-8be06112fb73
fee4bb62-9882-4c4b-b1bb-c9e409ccec08	crewassrun	Crewassrun	<p>16 ноября, воскресенье – последние осенние деньки уступают место зимней свежести! Присоединяйтесь к нашей пробежке, чтобы зарядиться энергией перед наступлением холодов и насладиться красотой поздней осени.</p><p>📅 Когда и где?</p><p>Воскресенье, 16 ноября</p><p>Сбор в 12:15</p><p>Старт от кафе "Щегол" (Радищева 38/20)</p><p>🏃‍♀️ Маршруты и темп:</p><p>🍂 5 км — темп 6:00–6:30 мин/км (для неспешной прогулки по осеннему городу)</p><p>⚡️ 10 км — темп 5:00–5:30 мин/км (для энергичного бега в прохладную погоду)</p><p>☕️ Финиш в кафе "Щегол":</p><p>• Горячий кофе и согревающий чай</p><p>• Свежая выпечка и вкусные угощения</p><p>• Теплая атмосфера для дружеского общения</p><p>Почему это стоит вашего воскресенья?</p><p>✅ Последняя возможность пробежаться в этом сезоне с комфортом</p><p>✅ Бодрящая атмосфера поздней осени</p><p>✅ Идеальный способ провести воскресный день с пользой и удовольствием</p><p>16 ноября, 12:15 – встречаемся, чтобы бежать навстречу зиме! 🌟🏃‍♂️☕️</p><p></p>	2025-11-16 09:15:00	\N	\N	\N	\N	\N	\N	\N	/uploads/covers/xWbnR0lDul9Ua1xBZAERw.jpg	published	{}	2025-11-13 12:26:36.060915	club	5cb31f85-d3b9-40a4-a905-1640985a1a2a
\.


--
-- Data for Name: home_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.home_settings (id, hero_image_url, hero_title, hero_subtitle, about_title, about_text_1, about_text_2, stats_participants, stats_cities, stats_runs, stats_kilometers, updated_at) FROM stdin;
singleton	/uploads/hero/tPFYCI40VMealSRjAV7lO.jpg	Mikkeller Running Club	Мы бегаем. Мы пьём пиво. Мы друзья.	О клубе	С 5 августа 2017 года ценители пива и любители бега Святого Петербурга присоединились к семье MRC.	Традиционно забеги происходят каждую первую субботу месяца, а после забега все участники получают порцию "лучшего изотоника".	725+	8K	1500+	170K	2025-11-16 19:23:37.053
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.locations (id, slug, name, description, address, latitude, longitude, created_at, logo_url) FROM stdin;
5cb31f85-d3b9-40a4-a905-1640985a1a2a	schegol	Кафе Щегол	Щегол — спешелти-кофейня в историческом центре Петербурга.\n\nЗдесь мы сами обжариваем зерно, варим вкусный кофе и ежедневно готовим для наших гостей десерты. На витрине всегда найдутся авторские десерты, торты и печенья. А каждые выходные — в меню на пару дней появляется спеша-предложение.	ул. Радищева, д. 38/20	59.941895	30.363422	2025-11-13 11:43:48.149484	/uploads/logos/jQtMcLsxE4xF_iu-hJ4AP.webp
9bbf6849-e6aa-4ebe-9b75-8be06112fb73	steklo	Бар Стекло	Bar Beer Shop Стекло - пивной бар с коллосальным количеством импортного и крафтового пива! 18 кранов и более 500 сортов в стекле!	улица Кораблестроителей, 32к2	59.95302	30.216454	2025-11-12 22:57:21.872998	/uploads/logos/wiIYC6Hk_GDyslUyxikTF.jpg
b0a092ed-056a-439a-a162-a5d6a87d0908	knightberg	Бар Knightberg	Knightberg Brewery — семейная пивоварня, чья история уходит в 2007 год. Наш подход - традиции, инновации, качество\n\nМы поддерживаем любые начинания на пивном рынке, но при этом не в ущерб качеству нашей продукции. Мы открыты для любых новинок, а иногда делаем первыми то, что другие будут делать через годы.\nНо главное для нас - мастерство наших пивоваров и неизменное следование качеству.	Финляндский просп., д. 4Б	59.95631	30.34325	2025-11-13 12:17:51.319209	/uploads/logos/uUfCAbKMmeLhQTdt51MrM.jpg
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.news (id, slug, title, excerpt, content, cover_image_url, published_at, status, created_at, updated_at) FROM stdin;
e6e64a0c-30c5-4741-a665-76c1fa30b56d	greblya-v-studii-rock-the-cycle	Гребля в студии Rock the Cycle	Пока ты предавался осенней хандре, мы провели её ярко вместе со студией Rock the Cycle	<p>Пока ты предавался осенней хандре, мы провели её ярко вместе со студией Rock the Cycle (<a target="_blank" rel="noopener noreferrer nofollow" href="https://t.me/rockthecycle">https://t.me/rockthecycle</a>).</p><p>🚴‍♀️ В сентябре у нас был сайклинг<br>🚣🏿‍♀️ А в ноябре пробное занятие по гребле</p><p>Эмоции от занятий исключительно позитивные: студия стильная, тренеры заряжают, имеется всё необходимое для комфортных тренировок, да у них даже газированная вода на кране есть! А для любителей помахать кулаками, проводят занятия по фитбоксингу.</p><p>Напоминаем, что для мрсят до 15.12.25 г действует промокод mrcspb — на скидку 10% на пакет новичка (Start Rockin’ 3 тренировки).</p><p>А по этой ссылке можно глянуть абонементы: <a target="_blank" rel="noopener noreferrer nofollow" href="https://rockthecycle.ru/exercises/?utm_source=partners&amp;utm_medium=smm&amp;utm_campaign=mrcspb">https://rockthecycle.ru/exercises/?utm_source=partners&amp;utm_medium=smm&amp;utm_campaign=mrcspb</a></p>	/uploads/news/sLgExEibP_oeyYFreYmaK.jpg	2025-11-18 09:34:00	published	2025-11-18 09:35:06.651669	2025-11-18 09:35:06.651669
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, items, amount_total, currency, status, email, shipping_address, created_at, yookassa_payment_id) FROM stdin;
\.


--
-- Data for Name: page_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.page_settings (id, page_key, title, description, keywords, og_title, og_description, og_image_url, updated_at) FROM stdin;
3c0cd609-8679-4f53-9dcc-a0d94cf4c624	paceCalculator	Калькулятор темпа — Mikkeller Running Club	Бесплатный онлайн калькулятор темпа бега. Рассчитайте время финиша, темп на километр и планируйте тренировки для марафона и полумарафона.	калькулятор темпа бега, pace calculator, темп на км, марафон калькулятор, полумарафон время	Pace Calculator — Mikkeller Running Club	Free online running pace calculator. Calculate finish time, pace per km, and plan your marathon training.	\N	2025-11-17 17:40:04.069751
9ae4ccf4-a1ba-41c0-ba1c-10a7efffd083	home	Mikkeller Running Club SPb — Беговой клуб в Санкт-Петербурге	Присоединяйтесь к беговому сообществу Mikkeller Running Club в Санкт-Петербурге. Еженедельные пробежки, маршруты с GPX-треками, фотогалерея событий.	беговой клуб питер, mikkeller running club, бег спб, пробежки, running club spb	Mikkeller Running Club St. Petersburg	Join the Mikkeller Running Club community in St. Petersburg. Weekly runs, GPX routes, photo gallery.	\N	2025-11-17 18:20:58.003
d6a442b8-baa2-4301-8992-10f4d7e57553	events	События — Mikkeller Running Club	Расписание предстоящих забегов и прошедших событий Mikkeller Running Club. Маршруты с GPX-треками, фотографии и детали каждой пробежки.	расписание забегов санкт-петербург, беговые события, mikkeller runs, gpx треки	Events — Mikkeller Running Club	Upcoming runs and past events schedule with GPX routes and photos.	\N	2025-11-17 17:40:03.717372
561fa874-8cd0-4d3e-b803-39e9b9a88cae	locations	Локации — Mikkeller Running Club	Места встреч и партнёрские бары Mikkeller Running Club в Санкт-Петербурге. Адреса, карты и информация о локациях для пробежек.	бары mikkeller санкт-петербург, места встреч бегунов, running locations saint petersburg	Locations — Mikkeller Running Club	Meeting points and partner bars in Saint Petersburg with maps and details.	\N	2025-11-17 17:40:03.787206
0085ecdf-2e0d-4f4f-93ca-9f3769fce921	gallery	Фотогалерея — Mikkeller Running Club	Фотографии с пробежек Mikkeller Running Club. Атмосфера наших событий, участники и яркие моменты беговых встреч.	фото пробежек санкт-петербург, беговое сообщество фото, running club photos	Photo Gallery — Mikkeller Running Club	Photos from our runs, events, and community moments.	\N	2025-11-17 17:40:03.862093
b2b063f8-09cf-4431-aa9d-c7d48023ad02	shop	Магазин — Mikkeller Running Club	Официальный магазин брендовой экипировки Mikkeller Running Club. Футболки, шапки, аксессуары для бега с доставкой по России.	mikkeller одежда, беговая форма купить, running gear saint petersburg, мерч беговой клуб	Shop — Mikkeller Running Club	Official branded gear: t-shirts, caps, and running accessories with delivery across Russia.	\N	2025-11-17 17:40:03.932141
d8ceb34d-26e0-4489-b442-55beee75d0f0	about	О клубе — Mikkeller Running Club	История и философия Mikkeller Running Club. Узнайте о нашем беговом сообществе, правилах участия и ценностях клуба.	о клубе mikkeller, беговое сообщество санкт-петербург, running club philosophy	About — Mikkeller Running Club	Our story, philosophy, and community values. Learn about the running club that combines fitness and social connection.	\N	2025-11-17 17:40:04.000952
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.photos (id, event_id, title, description, url, thumb_url, status, created_at, admin_id) FROM stdin;
faab2a1b-04c7-4477-80f2-bf18c5c44b2d	\N	\N	\N	/uploads/photos/WlayouTyLM9WoB5wev7_v.jpg	/uploads/photos/WlayouTyLM9WoB5wev7_v.jpg	approved	2025-11-13 14:45:27.877734	12b921ae-3850-4e80-9732-fe2871839ab9
2b225715-16fa-4e5b-87bd-becb8e87eef7	\N	\N	\N	/uploads/photos/ICEuKsHtw9f5BPGNfTOFe.jpg	/uploads/photos/ICEuKsHtw9f5BPGNfTOFe.jpg	approved	2025-11-13 14:45:14.31955	12b921ae-3850-4e80-9732-fe2871839ab9
3acb7f79-c379-44a9-8e7e-1b612bfcaec6	\N	\N	\N	/uploads/photos/9hIi93cMLkUQH18zAu_s3.jpg	/uploads/photos/9hIi93cMLkUQH18zAu_s3.jpg	approved	2025-11-13 14:45:04.920066	12b921ae-3850-4e80-9732-fe2871839ab9
714c1445-08d0-4497-bfd6-0fb54e9afb02	\N	\N	\N	/uploads/photos/hSTTASOkbNJvSODFeC_Fk.jpg	/uploads/photos/hSTTASOkbNJvSODFeC_Fk.jpg	approved	2025-11-13 14:44:32.625092	12b921ae-3850-4e80-9732-fe2871839ab9
017ec21d-2d13-481c-8026-171902c1a6f8	\N	\N	\N	/uploads/photos/k241dsH5X93poJCxAO7Oa.jpg	/uploads/photos/k241dsH5X93poJCxAO7Oa.jpg	approved	2025-11-13 14:44:43.014311	12b921ae-3850-4e80-9732-fe2871839ab9
6673e9b7-9e54-410b-8b1a-3bb08deae7bd	\N	\N	\N	/uploads/photos/Wj-u_kDTHXwXsKzyeAILI.jpg	/uploads/photos/Wj-u_kDTHXwXsKzyeAILI.jpg	approved	2025-11-13 14:44:54.275444	12b921ae-3850-4e80-9732-fe2871839ab9
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, slug, title, description, images, category, active, created_at, base_price) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
mj4nliyUwQUYYUfNjoaH-RUmmN8XpjV_	{"cookie": {"path": "/", "secure": true, "expires": "2025-11-19T19:04:16.089Z", "httpOnly": true, "originalMaxAge": 604800000}, "adminId": "12b921ae-3850-4e80-9732-fe2871839ab9", "messages": ["Unable to verify authorization request state", "Unable to verify authorization request state", "Unable to verify authorization request state"]}	2025-11-25 17:09:02
\.


--
-- Data for Name: strava_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.strava_accounts (id, user_id, strava_id, access_token, refresh_token, expires_at, first_name, last_name, profile_picture, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, role, created_at, first_name, last_name, profile_image_url, updated_at) FROM stdin;
\.


--
-- Data for Name: variants; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.variants (id, product_id, size, color, sku, stock, price) FROM stdin;
\.


--
-- Name: about_settings about_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.about_settings
    ADD CONSTRAINT about_settings_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: event_routes event_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_routes
    ADD CONSTRAINT event_routes_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: events events_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_slug_unique UNIQUE (slug);


--
-- Name: home_settings home_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.home_settings
    ADD CONSTRAINT home_settings_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: locations locations_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_slug_key UNIQUE (slug);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_key UNIQUE (slug);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders orders_yookassa_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_yookassa_payment_id_key UNIQUE (yookassa_payment_id);


--
-- Name: page_settings page_settings_page_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.page_settings
    ADD CONSTRAINT page_settings_page_key_key UNIQUE (page_key);


--
-- Name: page_settings page_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.page_settings
    ADD CONSTRAINT page_settings_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: strava_accounts strava_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.strava_accounts
    ADD CONSTRAINT strava_accounts_pkey PRIMARY KEY (id);


--
-- Name: strava_accounts strava_accounts_strava_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.strava_accounts
    ADD CONSTRAINT strava_accounts_strava_id_key UNIQUE (strava_id);


--
-- Name: strava_accounts strava_accounts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.strava_accounts
    ADD CONSTRAINT strava_accounts_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: variants variants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (id);


--
-- Name: variants variants_sku_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_sku_unique UNIQUE (sku);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: activities_sport_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX activities_sport_type_idx ON public.activities USING btree (sport_type);


--
-- Name: activities_start_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX activities_start_date_idx ON public.activities USING btree (start_date);


--
-- Name: activities_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX activities_user_id_idx ON public.activities USING btree (user_id);


--
-- Name: idx_news_published_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_news_published_at ON public.news USING btree (published_at);


--
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- Name: idx_news_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_news_status ON public.news USING btree (status);


--
-- Name: strava_accounts_strava_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX strava_accounts_strava_id_idx ON public.strava_accounts USING btree (strava_id);


--
-- Name: strava_accounts_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX strava_accounts_user_id_idx ON public.strava_accounts USING btree (user_id);


--
-- Name: event_routes event_routes_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_routes
    ADD CONSTRAINT event_routes_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: events events_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;


--
-- Name: photos photos_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE CASCADE;


--
-- Name: photos photos_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: variants variants_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict 5ejffaVM1HBbcxBUtGU1xNkTVGfz7M7pUwzD5kxaHx3t2yYi42g4OEOHFQSCJ9J

