--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2023-07-20 13:47:30

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
-- TOC entry 16 (class 2615 OID 241109)
-- Name: akademia; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA akademia;


ALTER SCHEMA akademia OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 312 (class 1259 OID 241686)
-- Name: dokumenty; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.dokumenty (
    id_dokumentu integer NOT NULL,
    id_pracy integer NOT NULL,
    typ character varying(255) NOT NULL,
    nazwa character varying(255) NOT NULL,
    sciezka character varying(255) NOT NULL
);


ALTER TABLE akademia.dokumenty OWNER TO "postgres";

--
-- TOC entry 311 (class 1259 OID 241685)
-- Name: dokumenty_id_dokumentu_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.dokumenty_id_dokumentu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.dokumenty_id_dokumentu_seq OWNER TO "postgres";

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 311
-- Name: dokumenty_id_dokumentu_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.dokumenty_id_dokumentu_seq OWNED BY akademia.dokumenty.id_dokumentu;


--
-- TOC entry 301 (class 1259 OID 241577)
-- Name: haslo; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.haslo (
    id_hasla integer NOT NULL,
    id_uzytkownika integer NOT NULL,
    haslo character varying(255) NOT NULL
);


ALTER TABLE akademia.haslo OWNER TO "postgres";

--
-- TOC entry 300 (class 1259 OID 241576)
-- Name: haslo_id_hasla_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.haslo_id_hasla_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.haslo_id_hasla_seq OWNER TO "postgres";

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 300
-- Name: haslo_id_hasla_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.haslo_id_hasla_seq OWNED BY akademia.haslo.id_hasla;


--
-- TOC entry 304 (class 1259 OID 241611)
-- Name: nauczyciel; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.nauczyciel (
    id_nauczyciela integer NOT NULL,
    stopien_naukowy character varying(255) NOT NULL,
    id_uzytkownika integer NOT NULL
);


ALTER TABLE akademia.nauczyciel OWNER TO "postgres";

--
-- TOC entry 303 (class 1259 OID 241610)
-- Name: nauczyciel_id_nauczyciela_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.nauczyciel_id_nauczyciela_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.nauczyciel_id_nauczyciela_seq OWNER TO "postgres";

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 303
-- Name: nauczyciel_id_nauczyciela_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.nauczyciel_id_nauczyciela_seq OWNED BY akademia.nauczyciel.id_nauczyciela;


--
-- TOC entry 306 (class 1259 OID 241623)
-- Name: praca_dyplomowa; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.praca_dyplomowa (
    id_pracy integer NOT NULL,
    temat character varying(255) NOT NULL,
    id_nauczyciela integer NOT NULL,
    status character varying(255)
);


ALTER TABLE akademia.praca_dyplomowa OWNER TO "postgres";

--
-- TOC entry 305 (class 1259 OID 241622)
-- Name: praca_dyplomowa_id_pracy_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.praca_dyplomowa_id_pracy_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.praca_dyplomowa_id_pracy_seq OWNER TO "postgres";

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 305
-- Name: praca_dyplomowa_id_pracy_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.praca_dyplomowa_id_pracy_seq OWNED BY akademia.praca_dyplomowa.id_pracy;


--
-- TOC entry 308 (class 1259 OID 241638)
-- Name: recenzja; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.recenzja (
    id_recenzji integer NOT NULL,
    id_nauczyciela integer NOT NULL,
    id_pracy integer NOT NULL,
    tresc_recenzji text NOT NULL
);


ALTER TABLE akademia.recenzja OWNER TO "postgres";

--
-- TOC entry 307 (class 1259 OID 241637)
-- Name: recenzja_id_recenzji_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.recenzja_id_recenzji_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.recenzja_id_recenzji_seq OWNER TO "postgres";

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 307
-- Name: recenzja_id_recenzji_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.recenzja_id_recenzji_seq OWNED BY akademia.recenzja.id_recenzji;


--
-- TOC entry 302 (class 1259 OID 241600)
-- Name: student; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.student (
    numer_albumu integer NOT NULL,
    kierunek character varying(255) NOT NULL,
    id_uzytkownika integer NOT NULL
);


ALTER TABLE akademia.student OWNER TO "postgres";

--
-- TOC entry 314 (class 1259 OID 241703)
-- Name: token; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.token (
    id_tokena integer NOT NULL,
    id_uzytkownika integer NOT NULL,
    data_utworzenia timestamp without time zone NOT NULL,
    typ character varying(255) NOT NULL,
    wartosc text NOT NULL
);


ALTER TABLE akademia.token OWNER TO "postgres";

--
-- TOC entry 313 (class 1259 OID 241702)
-- Name: token_id_tokena_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.token_id_tokena_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.token_id_tokena_seq OWNER TO "postgres";

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 313
-- Name: token_id_tokena_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.token_id_tokena_seq OWNED BY akademia.token.id_tokena;


--
-- TOC entry 299 (class 1259 OID 241565)
-- Name: uzytkownik; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.uzytkownik (
    id_uzytkownika integer NOT NULL,
    imie character varying(255) NOT NULL,
    nazwisko character varying(255) NOT NULL,
    adres_email character varying(255) NOT NULL,
    login character varying(255) NOT NULL,
    rola character varying(255) NOT NULL,
    aktywny boolean NOT NULL,
    czy_administrator boolean NOT NULL
);


ALTER TABLE akademia.uzytkownik OWNER TO "postgres";

--
-- TOC entry 298 (class 1259 OID 241564)
-- Name: uzytkownik_id_uzytkownika_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.uzytkownik_id_uzytkownika_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.uzytkownik_id_uzytkownika_seq OWNER TO "postgres";

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 298
-- Name: uzytkownik_id_uzytkownika_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.uzytkownik_id_uzytkownika_seq OWNED BY akademia.uzytkownik.id_uzytkownika;


--
-- TOC entry 310 (class 1259 OID 241669)
-- Name: wybor_studenta; Type: TABLE; Schema: akademia; Owner: postgres
--

CREATE TABLE akademia.wybor_studenta (
    id_wyboru integer NOT NULL,
    numer_albumu integer NOT NULL,
    id_pracy integer NOT NULL
);


ALTER TABLE akademia.wybor_studenta OWNER TO "postgres";

--
-- TOC entry 309 (class 1259 OID 241668)
-- Name: wybor_studenta_id_wyboru_seq; Type: SEQUENCE; Schema: akademia; Owner: postgres
--

CREATE SEQUENCE akademia.wybor_studenta_id_wyboru_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE akademia.wybor_studenta_id_wyboru_seq OWNER TO "postgres";

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 309
-- Name: wybor_studenta_id_wyboru_seq; Type: SEQUENCE OWNED BY; Schema: akademia; Owner: postgres
--

ALTER SEQUENCE akademia.wybor_studenta_id_wyboru_seq OWNED BY akademia.wybor_studenta.id_wyboru;


--
-- TOC entry 4845 (class 2604 OID 241689)
-- Name: dokumenty id_dokumentu; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.dokumenty ALTER COLUMN id_dokumentu SET DEFAULT nextval('akademia.dokumenty_id_dokumentu_seq'::regclass);


--
-- TOC entry 4840 (class 2604 OID 241580)
-- Name: haslo id_hasla; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.haslo ALTER COLUMN id_hasla SET DEFAULT nextval('akademia.haslo_id_hasla_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 241614)
-- Name: nauczyciel id_nauczyciela; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.nauczyciel ALTER COLUMN id_nauczyciela SET DEFAULT nextval('akademia.nauczyciel_id_nauczyciela_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 241626)
-- Name: praca_dyplomowa id_pracy; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.praca_dyplomowa ALTER COLUMN id_pracy SET DEFAULT nextval('akademia.praca_dyplomowa_id_pracy_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 241641)
-- Name: recenzja id_recenzji; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.recenzja ALTER COLUMN id_recenzji SET DEFAULT nextval('akademia.recenzja_id_recenzji_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 241706)
-- Name: token id_tokena; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.token ALTER COLUMN id_tokena SET DEFAULT nextval('akademia.token_id_tokena_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 241568)
-- Name: uzytkownik id_uzytkownika; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.uzytkownik ALTER COLUMN id_uzytkownika SET DEFAULT nextval('akademia.uzytkownik_id_uzytkownika_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 241672)
-- Name: wybor_studenta id_wyboru; Type: DEFAULT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.wybor_studenta ALTER COLUMN id_wyboru SET DEFAULT nextval('akademia.wybor_studenta_id_wyboru_seq'::regclass);


--
-- TOC entry 5042 (class 0 OID 241686)
-- Dependencies: 312
-- Data for Name: dokumenty; Type: TABLE DATA; Schema: akademia; Owner: postgres
--



--
-- TOC entry 5031 (class 0 OID 241577)
-- Dependencies: 301
-- Data for Name: haslo; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.haslo VALUES (1, 2, 'ak8285454');


--
-- TOC entry 5034 (class 0 OID 241611)
-- Dependencies: 304
-- Data for Name: nauczyciel; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.nauczyciel VALUES (1, 'dr inż.', 1);
INSERT INTO akademia.nauczyciel VALUES (2, 'mgr inż.', 2);


--
-- TOC entry 5036 (class 0 OID 241623)
-- Dependencies: 306
-- Data for Name: praca_dyplomowa; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.praca_dyplomowa VALUES (1, 'Aplikacja do zarządzania tematami prac dyplomowych', 2, 'w trakcie');
INSERT INTO akademia.praca_dyplomowa VALUES (2, 'E-dziennik', 2, 'w trakcie');


--
-- TOC entry 5038 (class 0 OID 241638)
-- Dependencies: 308
-- Data for Name: recenzja; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.recenzja VALUES (1, 2, 1, 'Bardzo dobra praca. Naprawdę student się napracował');


--
-- TOC entry 5032 (class 0 OID 241600)
-- Dependencies: 302
-- Data for Name: student; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.student VALUES (34306, 'informatyka', 3);


--
-- TOC entry 5044 (class 0 OID 241703)
-- Dependencies: 314
-- Data for Name: token; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.token VALUES (1, 3, '2023-07-15 00:00:00', 'autoryzacja', '2483kfddsnas');


--
-- TOC entry 5029 (class 0 OID 241565)
-- Dependencies: 299
-- Data for Name: uzytkownik; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.uzytkownik VALUES (1, 'Radosław', 'Klimek', 'rklimek@agh.pl', 'rklimek123', 'nauczyciel', true, false);
INSERT INTO akademia.uzytkownik VALUES (2, 'Dariusz', 'Piwko', 'dpiwko@pwsztar.pl', 'dpiwko123', 'nauczyciel', true, true);
INSERT INTO akademia.uzytkownik VALUES (3, 'Wiktor', 'Markowicz', '34306@student.pwsztar.edu.pl', '34306', 'student', true, false);


--
-- TOC entry 5040 (class 0 OID 241669)
-- Dependencies: 310
-- Data for Name: wybor_studenta; Type: TABLE DATA; Schema: akademia; Owner: postgres
--

INSERT INTO akademia.wybor_studenta VALUES (1, 34306, 1);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 311
-- Name: dokumenty_id_dokumentu_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.dokumenty_id_dokumentu_seq', 1, false);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 300
-- Name: haslo_id_hasla_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.haslo_id_hasla_seq', 1, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 303
-- Name: nauczyciel_id_nauczyciela_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.nauczyciel_id_nauczyciela_seq', 2, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 305
-- Name: praca_dyplomowa_id_pracy_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.praca_dyplomowa_id_pracy_seq', 2, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 307
-- Name: recenzja_id_recenzji_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.recenzja_id_recenzji_seq', 1, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 313
-- Name: token_id_tokena_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.token_id_tokena_seq', 1, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 298
-- Name: uzytkownik_id_uzytkownika_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.uzytkownik_id_uzytkownika_seq', 3, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 309
-- Name: wybor_studenta_id_wyboru_seq; Type: SEQUENCE SET; Schema: akademia; Owner: postgres
--

SELECT pg_catalog.setval('akademia.wybor_studenta_id_wyboru_seq', 1, true);


--
-- TOC entry 4864 (class 2606 OID 241693)
-- Name: dokumenty dokumenty_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.dokumenty
    ADD CONSTRAINT dokumenty_pkey PRIMARY KEY (id_dokumentu);


--
-- TOC entry 4852 (class 2606 OID 241582)
-- Name: haslo haslo_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.haslo
    ADD CONSTRAINT haslo_pkey PRIMARY KEY (id_hasla);


--
-- TOC entry 4856 (class 2606 OID 241616)
-- Name: nauczyciel nauczyciel_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.nauczyciel
    ADD CONSTRAINT nauczyciel_pkey PRIMARY KEY (id_nauczyciela);


--
-- TOC entry 4854 (class 2606 OID 241604)
-- Name: student pk_student; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.student
    ADD CONSTRAINT pk_student PRIMARY KEY (numer_albumu);


--
-- TOC entry 4858 (class 2606 OID 241630)
-- Name: praca_dyplomowa praca_dyplomowa_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.praca_dyplomowa
    ADD CONSTRAINT praca_dyplomowa_pkey PRIMARY KEY (id_pracy);


--
-- TOC entry 4860 (class 2606 OID 241645)
-- Name: recenzja recenzja_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.recenzja
    ADD CONSTRAINT recenzja_pkey PRIMARY KEY (id_recenzji);


--
-- TOC entry 4866 (class 2606 OID 241710)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id_tokena);


--
-- TOC entry 4848 (class 2606 OID 241574)
-- Name: uzytkownik uq_uzytkownik_login; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.uzytkownik
    ADD CONSTRAINT uq_uzytkownik_login UNIQUE (login);


--
-- TOC entry 4850 (class 2606 OID 241572)
-- Name: uzytkownik uzytkownik_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.uzytkownik
    ADD CONSTRAINT uzytkownik_pkey PRIMARY KEY (id_uzytkownika);


--
-- TOC entry 4862 (class 2606 OID 241674)
-- Name: wybor_studenta wybor_pkey; Type: CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.wybor_studenta
    ADD CONSTRAINT wybor_pkey PRIMARY KEY (id_wyboru);


--
-- TOC entry 4870 (class 2606 OID 241631)
-- Name: praca_dyplomowa fk_nauczyciel; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.praca_dyplomowa
    ADD CONSTRAINT fk_nauczyciel FOREIGN KEY (id_nauczyciela) REFERENCES akademia.nauczyciel(id_nauczyciela);


--
-- TOC entry 4871 (class 2606 OID 241646)
-- Name: recenzja fk_nauczyciel; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.recenzja
    ADD CONSTRAINT fk_nauczyciel FOREIGN KEY (id_nauczyciela) REFERENCES akademia.nauczyciel(id_nauczyciela);


--
-- TOC entry 4869 (class 2606 OID 241617)
-- Name: nauczyciel fk_nauczyciel_uzytkownicy; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.nauczyciel
    ADD CONSTRAINT fk_nauczyciel_uzytkownicy FOREIGN KEY (id_uzytkownika) REFERENCES akademia.uzytkownik(id_uzytkownika);


--
-- TOC entry 4872 (class 2606 OID 241651)
-- Name: recenzja fk_praca; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.recenzja
    ADD CONSTRAINT fk_praca FOREIGN KEY (id_pracy) REFERENCES akademia.praca_dyplomowa(id_pracy);


--
-- TOC entry 4873 (class 2606 OID 241675)
-- Name: wybor_studenta fk_praca; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.wybor_studenta
    ADD CONSTRAINT fk_praca FOREIGN KEY (id_pracy) REFERENCES akademia.praca_dyplomowa(id_pracy);


--
-- TOC entry 4875 (class 2606 OID 241694)
-- Name: dokumenty fk_praca; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.dokumenty
    ADD CONSTRAINT fk_praca FOREIGN KEY (id_pracy) REFERENCES akademia.praca_dyplomowa(id_pracy);


--
-- TOC entry 4874 (class 2606 OID 241680)
-- Name: wybor_studenta fk_student; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.wybor_studenta
    ADD CONSTRAINT fk_student FOREIGN KEY (numer_albumu) REFERENCES akademia.student(numer_albumu);


--
-- TOC entry 4868 (class 2606 OID 241605)
-- Name: student fk_student_uzytkownicy; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.student
    ADD CONSTRAINT fk_student_uzytkownicy FOREIGN KEY (id_uzytkownika) REFERENCES akademia.uzytkownik(id_uzytkownika);


--
-- TOC entry 4867 (class 2606 OID 241583)
-- Name: haslo fk_uzytkownik; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.haslo
    ADD CONSTRAINT fk_uzytkownik FOREIGN KEY (id_uzytkownika) REFERENCES akademia.uzytkownik(id_uzytkownika);


--
-- TOC entry 4876 (class 2606 OID 241711)
-- Name: token uzytkownik_fkey; Type: FK CONSTRAINT; Schema: akademia; Owner: postgres
--

ALTER TABLE ONLY akademia.token
    ADD CONSTRAINT uzytkownik_fkey FOREIGN KEY (id_uzytkownika) REFERENCES akademia.uzytkownik(id_uzytkownika);


-- Completed on 2023-07-20 13:47:31

--
-- PostgreSQL database dump complete
--

