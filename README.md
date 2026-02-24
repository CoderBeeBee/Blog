ENGLISH VERSION BELOW

```bash
📦 System blogowo-wydawniczy

1️⃣ Wprowadzenie

Nazwa systemu: System blogowo-wydawniczy dla firm / portali / twórców
Wersja: 1.0
Autor: CoderBee
Kontakt: coderBee@proton.me
Typ licencji: single-use – prawo do używania  1 domenie
Cel: Dokumentacja pozwala na łatwe uruchomienie systemu, konfigurację, obsługę panelu admina i użytkownika oraz dalszy rozwój bez dodatkowej pomocy autora.
## Kod autora:
- Wszystkie elementy kodu frontend i backend zostały napisane wyłącznie przeze mnie.
- **Użycie komercyjne kodu jest zabronione** bez mojej wyraźnej zgody.
- Kod można używać, modyfikować i wdrażać **do celów wyłącznie edukacyjnych**, **nie można go sprzedawać ani rozpowszechniać komercyjnie**.

## Szablon graficzny (Styleshout):
- Projekt korzysta z szablonu Styleshout [https://styleshout.com/](https://styleshout.com/) na      
  licencji ich strony.
- Szablon można używać i modyfikować w projektach, również komercyjnych, **pod warunkiem podania odpowiedniego źródła**:


2️⃣ Funkcje aplikacji

### 🧑‍💻 Użytkownicy

- Rejestracja i logowanie
- Weryfikacja email (link aktywacyjny)
- JWT authentication
- Panel użytkownika: zmiana hasła, avatara, nazwy konta, emaila, usuwanie konta


### 📝 Posty

- Dodawanie postów
- Edycja postów
- Usuwanie postów
- Przeglądanie wszystkich postów
- Widok pojedynczego postu
- Kategorie postów w menu
- Wyszukiwarka po tytułach postów

### 💬 Komentarze

- Dodawanie komentarzy
- Edycja komentarzy
- Usuwanie komentarzy
- Przypisanie komentarzy do użytkownika i do posta


### 📊 Panel Administratora

- Dashboard z live statystykami: wyświetlenia, użytkownicy, posty, komentarze, polubienia
- Tabela adminów i moderatorów z wyszukiwarką
- Zarządzanie użytkownikami, postami, komentarzami
- Historia działań adminów


### 🎨 UI / UX

- Nowoczesny layout inspirowany **Pinterest**
- Masonry / waterfall grid
- Responsywny design (mobile-first)
- Intuicyjny interfejs w React

---

## 🧰 Technologie

### Frontend

- **React** (Hooks, komponenty funkcyjne)
- React Router
- React Redux
- React ReduxJs/Toolkit
- React Hook Form
- ZOD
- JS-Cookie
- CSS / SCSS / Styled Components
- Responsywna architektura

### Backend

- **Node.js + Express**
- REST API
- Kontrolery + route’y + middleware
- JWT
- Obsługa błędów
- Zabezpieczenia podstawowe

### Baza danych

- MongoDB

### 📸 Obrazy

- Wgrywanie obrazów na **Cloudinary**
- Obrazy przypisane do posta

---

## 📦 Instalacja i uruchomienie

Wymagania systemowe:
  Node.js >= 20.x
  Edytor kodu ( Visual studio Code )
  MongoDB >= 7.x ( lub wersja online )
  Cloudinary ( konto i API key do wgrywania obrazów )
  Przeglądarka : Chrome, Firefox, Edge, Safari


### 1. Sklonuj repo:


git clone <twoje-repo-url>
cd <folder-projektu>


🔧 Backend
Instalacja zależności
cd backend
npm install

Zmienne środowiskowe

Utwórz plik .env w folderze backend(lub na serwerze w ustawieniach Environment dodaj zależności ) i dodaj zależności:

# Konto administratora
ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'test'
# URL strony
SITE_URL = 'http://localhost:5173' - lolcalhost na ktorym sie włącza frontend lub w produkcji link strony
# Port backendu
PORT = 8000
# MongoDB
MONGODB_URL = 'your_database_url'
# JWT do autoryzacji
JWT_SECRET = 'your_secret_key'
# Środowisko
NODE_ENV = 'development'
# Cloudinary do wgrywania obrazów
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
# reCAPTCHA
RECAPTCHA_SECRET =

Start backendu
npm run dev lub cd .. npm run backend

Backend uruchomi się pod adresem: http://localhost:8000


🎨 Frontend
Instalacja zależności
cd frontend
npm install

🔗 Połączenie front-back
Jeżeli nie ma pliku .env -> utwórz plik .env w folderze frontendu i dodaj zależności:

VITE_API_URL = http://localhost:8000 - na produkcji API backendu(serwera)
VITE_SITE_URL = 'nazwa strony'
# ENDPOINTS
VITE_POSTS_URL = '/api/posts'
VITE_USERS_URL = '/api/users'
VITE_COMMENTS_URL = '/api/comments'
VITE_SIGNATURE_URL = '/api/signature'
VITE_STATISTICS_URL = '/api/statistics'
VITE_POSTLIKE_URL = '/api/postlike'
VITE_CATEGORY_URL = '/api/category'
VITE_EMAIL_URL = '/api/email'
VITE_GENERAL_URL = '/api/general'
VITE_LEGAL_URL = '/api/legal'

# CLOUDINARY API
VITE_CLOUDINARY_CLOUD_NAME = 'cloudinary_name'
VITE_UPLOAD_PRESET = 'frontend/upload_images'
VITE_UPLOAD_AVATARS = 'frontend/avatars'
VITE_UPLOAD_LOGO = 'frontend/logo'
VITE_UPLOAD_FAVICON = 'frontend/favicon'

# GOOGLE TAG MANAGER LINK
VITE_GTM_ID = G-XXXXXXXXXX

VITE_NODE_ENV = 'production'

Start aplikacji
npm run dev || lub cd ..  npm run frontend

Frontend uruchomi się pod adresem: http://localhost:5173
Tworzenie wersji produkcyjnej: w folderze frontend w pliku .env zmieniamy VITE_API_URL na URL naszego hostingu plików backendu oraz VITE_SITE_URL czyli nazwa naszej domeny, potem w terminalu wpisujemy: npm run build , następnie stworzy nam plik dist, jeżeli tworzenie się powiedzie będziemy mogli sprawdzić projekt pod adresem : 'http://localhost:4173'.
Plik ten wrzucamy na hosting frontendowy


🗂 Struktura projektu
/frontend
  /public        # statyczne pliki (favicon, ikony, logo)
  /src
    /assets      # obrazy, ikony, style globalne
    /components  # komponenty UI: atoms, modules, organism, pages, templates
    /containers  # logika wyższych komponentów
    /context     # React context / global state
    /hooks       # custom hooks
    /slices      # Redux slices
    /types       # TypeScript typy
    /utils       # funkcje pomocnicze
    App.scss
    App.tsx
    main.tsx
    store.ts
  .env           # konfiguracja środowiska frontend


/backend
  /config        # konfiguracja serwera i bazy danych
  /controllers   # logika endpointów
  /data          # inicjalizacja danych
  /email         # szablony i funkcje mailowe
  /middlewares   # autoryzacja, error handling
  /models        # schematy MongoDB
  /routes        # definicje API
  /services      # serwisy pomocnicze (newsletter, statystyki)
  /templates     # szablony email
  /tests         # testy jednostkowe i integracyjne
  /utils         # funkcje pomocnicze
  index.js       # start backendu
  .env           # zmienne środowiskowe backendu



📄 Licencja / Prawa autorskie

## Licencje użytych ikon

- **Calcite UI Icons**
  Author: Esri
  License: MIT
  Repo: [https://github.com/Esri/calcite-ui-icons](https://github.com/Esri/calcite-ui-icons)
  *MIT pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Nuiverse Icons**
  Author: Nuiverse Design
  License: BSD
  Repo: [https://gitlab.com/nuinalp/open-source/nuiverse/icons](https://gitlab.com/nuinalp/open-source/nuiverse/icons)
  *BSD pozwala na użycie, modyfikację i dystrybucję pod warunkiem dołączenia oryginalnej licencji.*

- **Unicons**
  Author: Iconscout
  License: Apache License 2.0
  Repo: [https://github.com/Iconscout/unicons](https://github.com/Iconscout/unicons)
  *Apache 2.0 pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Neuicons**
  Author: Neuicons
  License: MIT
  Repo: [https://github.com/neuicons/neu](https://github.com/neuicons/neu)
  *MIT pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Fontisto**
  Autor: Kenan Gündoğan
  Licencja: MIT
  Repo: [https://github.com/kenangundogan/fontisto](https://github.com/kenangundogan/fontisto)
  *MIT pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Ant Design Icons**
  Autor: Ant Design
  Licencja: MIT
  Repozytorium: [https://github.com/ant-design/ant-design-icons](https://github.com/ant-design/ant-design-icons )
  *MIT pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Radix UI Icons**
  Autor: Radix UI
  Licencja: MIT
  Repozytorium: [https://github.com/radix-ui/icons](https://github.com/radix-ui/icons)
  *MIT pozwala na użycie, modyfikację i dystrybucję (również komercyjną) pod warunkiem zachowania informacji o licencji i autorze.*

- **Flat UI**
  Autor: Designmodo
  Licencja: MIT
  Repozytorium: [https://github.com/designmodo/Flat-UI](https://github.com/designmodo/Flat-UI)
  *MIT pozwala na używanie, modyfikowanie oraz rozpowszechnianie (również komercyjne), pod warunkiem zachowania informacji o autorze i treści licencji.*

- **Education Icooon Mono Vectors**
  Autor: Icooon Mono
  Licencja: Domena publiczna (PD)
  *Ten zasób znajduje się w domenie publicznej. Możesz go używać, modyfikować i rozpowszechniać dowolnie, także w celach komercyjnych, bez konieczności podawania autora.*

- **JoyPixels Emojione**
  Autor: JoyPixels
  Licencja: MIT
  Repozytorium: [https://github.com/joypixels/emojione](https://github.com/joypixels/emojione )
  *MIT pozwala na używanie, modyfikowanie oraz rozpowszechnianie (również komercyjne), pod warunkiem zachowania informacji o autorze i treści licencji.*

- **Clarity Assets (VMware)**
  Autor: VMware
  Licencja: MIT
  Repozytorium: [https://github.com/vmware/clarity-assets](https://github.com/vmware/clarity-assets )
  *MIT pozwala na używanie, modyfikowanie oraz rozpowszechnianie (również komercyjne), pod warunkiem zachowania informacji o autorze i treści licencji.*

- **Solar Outline Icons**
  Autor: Solar Icons
  Licencja: Creative Commons Uznanie autorstwa 4.0 Międzynarodowa (CC BY 4.0)
  *Licencja CC BY 4.0 pozwala na używanie, modyfikację oraz rozpowszechnianie (w tym w celach komercyjnych), pod warunkiem podania informacji o autorze oraz dołączenia informacji o licencji.*

- **Wolf Kit Rounded Line Icons**
  Autor: thewolfkit
  Licencja: Creative Commons Uznanie autorstwa 4.0 Międzynarodowa (CC BY 4.0)
 *Licencja CC BY 4.0 pozwala na używanie, modyfikację oraz rozpowszechnianie (w tym w celach komercyjnych), pod warunkiem podania informacji o autorze oraz dołączenia informacji o licencji.*
 
- **Laura Reen Icons**
  Autor: Laura Reen
  Repozytorium: [http://laurareen.com/](http://laurareen.com/)
  Licencja: Creative Commons Uznanie autorstwa 4.0 Międzynarodowa (CC BY 4.0)
  *Licencja CC BY 4.0 pozwala na używanie, modyfikację oraz rozpowszechnianie (w tym w celach komercyjnych), pod warunkiem podania informacji o autorze oraz dołączenia informacji o licencji.*

- **Jtb Variety Oval Icons**
  Autor: jtblabs
  Licencja: MIT
  *Licencja MIT pozwala na użycie, modyfikację i dystrybucję (w tym w zastosowaniach komercyjnych), pod warunkiem dołączenia informacji o prawach autorskich oraz tekstu licencji.*

- **Teenyicons**
  Autor: teenyicons
  Licencja: MIT
  Repozytorium: [https://github.com/teenyicons/teenyicons](https://github.com/teenyicons/teenyicons)
  *Licencja MIT pozwala na użycie, modyfikację i dystrybucję (w tym w zastosowaniach komercyjnych), pod warunkiem dołączenia informacji o prawach autorskich oraz tekstu licencji.*

- **GitLab SVG Icons**
  Autor: GitLab
  Licencja: MIT
  Repozytorium: [https://gitlab.com/gitlab-org/gitlab-svgs](https://gitlab.com/gitlab-org/gitlab-svgs)
  *Licencja MIT pozwala na użycie, modyfikację i dystrybucję (w tym w zastosowaniach komercyjnych), pod warunkiem dołączenia informacji o prawach autorskich oraz tekstu licencji.*


---

# ❓ **FAQ dla kupującego (zaktualizowane)**

## **Q1: Czy projekt jest w pełni funkcjonalny?**

Tak — blog, posty, komentarze, autoryzacja i frontend działają w pełni.
Panel administracyjny jest częściowo ukończony (~50%), ale można go łatwo rozszerzyć.

## **Q2: Czy mogę używać projektu komercyjnie?**

Nie — kod tego projektu nie może być kopiowany, redystrybuowany ani sprzedawany w celach komercyjnych bez wyraźnej, pisemnej zgody autora.
Kod można używać i modyfikować wyłącznie do celów osobistych, edukacyjnych lub niekomercyjnych.

## **Q3: Czy mogę używać projektu dla klientów?**

Projekt można używać w projektach osobistych lub edukacyjnych, ale nie można go odsprzedawać ani redystrybuować komercyjnie.
Jeśli chcesz użyć projektu w celach komercyjnych, musisz skontaktować się z autorem w celu uzyskania zgody.

## **Q4: Czy mogę użyć szablonu Styleshout w moim projekcie?**

Tak — szablon można używać i modyfikować w projekcie, również komercyjnie, pod warunkiem podania odpowiedniego źródła:

Design template by Styleshout.com


Nie wolno natomiast redystrybuować ani sprzedawać samego szablonu.

## **Q5: Czy projekt działa na urządzeniach mobilnych?**

Tak — UI jest w pełni responsywne i zoptymalizowane pod wszystkie rozmiary ekranów.

## **Q6: Czy mogę modyfikować wygląd?**

Tak — wszystkie komponenty frontendu są modularne, więc można dowolnie zmieniać style, układ i funkcjonalności.

## **Q7: Jak działa wgrywanie obrazków?**

Obrazy są wgrywane przez Cloudinary i przypisane do postów.
Do działania potrzebne jest własne konto Cloudinary i dane API.

## **Q8: Czy projekt posiada funkcję wyszukiwania?**

Tak — użytkownicy mogą wyszukiwać posty po tytułach.

## **Q9: Czy projekt obsługuje kategorie postów?**

Tak — kategorie są wyświetlane w menu i można je przypisywać do postów.

## **Q10: Co jest potrzebne do wdrożenia?**

Hosting backendu (Render, Railway lub własny serwer)

Hosting frontendu (Twoja strona lub serwer)

Połączenie z bazą danych (MongoDB )

Konto Cloudinary do wgrywania obrazków

## **Q11: Czy mogę samodzielnie dokończyć panel admina?**

Tak — panel administracyjny jest częściowo zaimplementowany i korzysta z tej samej struktury kodu, więc łatwo go rozszerzyć.

## **Q12: Czy aplikacja jest skalowalna dla wielu użytkowników?**

Tak — stos React + Node.js + baza danych jest skalowalny i nadaje się do projektów o dużym ruchu.

---


#ENGLISH VERSION



## Licenses for icons used

- **Calcite UI Icons**
  Author: Esri
  License: MIT
  Repo: [https://github.com/Esri/calcite-ui-icons](https://github.com/Esri/calcite-ui-icons)
  *MIT allows use, modification, and distribution, provided that the full license text is included.*

- **Nuiverse Icons**
  Author: Nuiverse Design
  License: BSD
  Repo: [https://gitlab.com/nuinalp/open-source/nuiverse/icons](https://gitlab.com/nuinalp/open-source/nuiverse/icons)
  *BSD allows use, modification, and distribution, provided that the original license is included.*

- **Unicons**
  Author: Iconscout
  License: Apache License 2.0
  Repo: [https://github.com/Iconscout/unicons](https://github.com/Iconscout/unicons)
  *Apache 2.0 allows use, modification, and distribution (including commercial), provided that the license and copyright notice are preserved.*

- **Neuicons**
  Author: Neuicons
  License: MIT
  Repo: [https://github.com/neuicons/neu](https://github.com/neuicons/neu)
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Fontisto**
  Author: Kenan Gündoğan
  License: MIT
  Repo: [https://github.com/kenangundogan/fontisto](https://github.com/kenangundogan/fontisto)
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Shopify Polaris**
  Author: Shopify
  License: MIT
  Repo: [https://github.com/Shopify/polaris](https://github.com/Shopify/polaris)
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Ant Design Icons**
  Author: Ant Design
  License: MIT
  Repo: [https://github.com/ant-design/ant-design-icons](https://github.com/ant-design/ant-design-icons )
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Radix UI Icons**
  Author: Radix UI
  License: MIT
  Repo: [https://github.com/radix-ui/icons](https://github.com/radix-ui/icons)
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Flat UI**
  Author: Designmodo
  License: MIT
  Repo: [https://github.com/designmodo/Flat-UI](https://github.com/designmodo/Flat-UI)
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Education Icooon Mono Vectors**
  Author: Icooon Mono
  License: Public Domain (PD)
  *This resource is in the public domain. You can use, modify, and redistribute it freely, including for commercial purposes, without attribution.*

- **JoyPixels Emojione**
  Author: JoyPixels
  License: MIT
  Repo: [https://github.com/joypixels/emojione](https://github.com/joypixels/emojione )
  *MIT allows use, modification, and redistribution (including commercial) as long as the license and copyright notice are preserved.*

- **Clarity Assets (VMware)**
  Author: VMware
  License: MIT
  Repository: [https://github.com/vmware/clarity-assets](https://github.com/vmware/clarity-assets )
  *MIT License allows use, modification, and distribution (including commercial use), provided that the copyright notice and license text are included.*

- **Solar Outline Icons**
  Author: Solar Icons
  License: Creative Commons Attribution 4.0 International (CC BY 4.0)
  *The CC BY 4.0 License allows use, modification, and distribution (including commercial use), provided that appropriate credit is given to the author and a reference to the license is included.*

- **Wolf Kit Rounded Line Icons**
  Author: thewolfkit
  License: Creative Commons Attribution 4.0 International (CC BY 4.0)
  License: [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
  *The CC BY 4.0 License allows use, modification, and distribution (including commercial use), provided that appropriate credit is given to the author and a reference to the license is included.*

- **Jtb Variety Oval Icons**
  Author: jtblabs
  License: MIT
  *The MIT License allows use, modification, and distribution (including commercial use), provided that the copyright notice and license text are included.*

- **Teenyicons**
  Author: teenyicons
  License: MIT
  Repository: [https://github.com/teenyicons/teenyicons](https://github.com/teenyicons/teenyicons)
  *The MIT License allows use, modification, and distribution (including commercial use), provided that the copyright notice and license text are included.*

- **GitLab SVG Icons**
  Author: GitLab
  License: MIT
  Repository: [https://gitlab.com/gitlab-org/gitlab-svgs](https://gitlab.com/gitlab-org/gitlab-svgs)
  *The MIT License allows use, modification, and distribution (including commercial use), provided that the copyright notice and license text are included.*



# ❓ **3. FAQ for Buyers**

### **Q1: Is this project fully functional?**

Yes — the blog, posts, comments, authentication, and frontend are fully functional.
The admin panel is partially completed (~50%) but can be easily extended.

### **Q2: Can I use the project commercially?**

No — the code of this project cannot be copied, redistributed, or sold for commercial purposes without the explicit written permission of the author.
You may use and modify it for personal, educational, or non-commercial deployment only.

### **Q3: Can I use this project with clients?**

You can use the project for personal or educational projects, but you cannot resell or redistribute it commercially.
If you want to use it for commercial purposes, you must contact the author for permission.

### **Q4: Can I use the included Styleshout template in my project?**

Yes — the template can be used and modified in your project, including commercial projects, as long as you give proper credit:

Design template by Styleshout.com

You cannot redistribute or sell the template itself.

### **Q5: Does the project support mobile devices?**

Yes — the UI is fully responsive and optimized for all screen sizes.

### **Q6: Can I customize the design?**

Yes — all frontend components are modular, so you can modify styles, layout, and functionality.

### **Q7: How does image uploading work?**

Images are uploaded via Cloudinary and attached to posts. You will need your own Cloudinary account and API credentials.

### **Q8: Does the project have search functionality?**

Yes — users can search posts by title.

### **Q9: Does the project support post categories?**

Yes — categories are displayed in the menu and can be assigned to posts.

### **Q10: What do I need for deployment?**

A hosting platform for the backend (Render, Railway, or your own server)

Hosting for the frontend (your website or server)

Database connection (MongoDB)

Cloudinary account for image uploads

### **Q11: Can I finish the admin panel myself?**

Yes — the admin panel is partially implemented and follows the same code structure, so it’s easy to extend.

### **Q12: Can the app scale for multiple users?**

Yes — the React + Node.js + database stack is scalable and suitable for high-traffic projects.

```
