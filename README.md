# HR App

![Logo](./images/logo.png)

**HR App** je puna web aplikacija za upravljanje zaposlenima, projektima, evidencijom prisustva i zahtevima za odsustvo. Cilj aplikacije je da omogući **HR radnicima** (user_role: `hr worker`) da:
- Dodeljuju zaposlene na projekte
- Praćenje metrika angažovanja i radnih sati
- Pregled i upravljanje svim zahtevima za odsustvo
- Eksport CSV podataka o angažovanjima

Dok **radnici** (user_role: `worker`) imaju na raspolaganju:
- Svoju listu aktivnih projekata
- Kreiranje i pregled sopstvenih zahteva za odsustvo
- Prijavu prisustva (status, radni sati, odsustvo, beleške)
- Pogled vlastitog attendance sheet-a

---

## Tehnologije

- **Frontend:**  
  - React JS (Create React App)  
  - CSS (modularni stilovi, varijable boja i fontova)  
- **Backend:**  
  - Laravel (PHP 8, Sanctum za autentikaciju)  
  - MySQL baza  
- **Javni web servisi:**  
  - **Open Meteo API** za trenutnu vremensku prognozu  
  - **Giphy API** za prikaz nasumičnog „GIF dana“  
- **Ostalo:**  
  - REST API rute  
  - Laravel DB namespace za direktne upite i pivot tabele  
  - CSV eksport via Laravel streaming response

---

## Glavne funkcionalnosti

### 1. Početna stranica  
- Kartica dobrodošlice  
- Kartica vremenske prognoze (Open Meteo)  
- Kartica „GIF dana“ (Giphy API)  
- Prikaz avatara i inicijala korisnika u navigaciji  

### 2. Projekti i zaposleni (HR radnik)  
- **Dvojna tabela**:  
  - Levo – lista svih projekata sa detaljima (ID, naziv, opis, početak, kraj, status)  
  - Desno – lista svih zaposlenih (ko nisu HR)  
- **Selektovanje** jednog projekta i jednog zaposlenog radio-butonima  
- Dugme **„Dodeli zaposlenog”**: POST `/employee-projects/assign`  
- Dugme **„Izmeni podatke projekta”**: otvara modal za promenu statusa (cancelled/active) i datuma  
- Tabela **angažovanja**: lista svih veza (`employee_projects`), sa imenima projekta i zaposlenog, vremenom dodele i akcijom za brisanje  
- Dugme **„Eksport CSV”**: GET `/employee-projects/export` – preuzimanje CSV fajla sa imenima i formatiranim datumom  

### 3. Moji projekti (Worker)  
- Stranica `ProjectsPage.jsx`  
- GET `/employee-projects` – svi projekti na kojima je trenutno angažovan  
- Mogućnost pretrage po nazivu projekta  

### 4. Zahtevi za odsustvo  
- Stranica `RequestsPage.jsx` i `HrRequestsPage.jsx`  
- Worker šalje novi zahtev sa datumima i tipom odsustva  
- Pregled sopstvenih zahteva  
- HR pregled svih zahteva, detalji, odobravanje/odbijanje (PATCH status)  
- Bojenje statusa u tabeli (zelena pilula za accepted, crvena za declined, narandžasta za sent)  

### 5. Prisustvo (Attendance)  
- Stranica `AttendancePage.jsx`  
- Worker prijavljuje prisustvo: bira projekat, status (`present|absent|on_leave`), unosi sate, tip odsustva i beleške  
- Pregled sopstvenih zapisa  
- HR pregled svih zaposlenih sa mogućnošću filtriranja po imenu i paginacijom  
- Metrika top 10 po radnim satima (`/attendances/metrics`)  

### 6. Dashboard metrika (HR radnik)  
- Stranica `HrHome.jsx`  
- Dva grafikona (Recharts + Tailwind):  
  1. Broj projekata po zaposlenom (`/employee-projects/metrics`)  
  2. Top 10 zaposlenih po ukupnim satima (`/attendances/metrics`)  

---

Instalacija i pokretanje
---------------------------

1. Klonirajte repozitorijum:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-hr_app_20210173_20210069.git
```
2. Pokrenite backend:
```bash
   cd hr-app
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd hr-front
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Backend API pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)