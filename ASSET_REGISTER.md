# LINAD — реестр материалов

Аудит: 17.10.2026. Исходники в `LINAD/` не изменялись.

| Ресурс | Размер | Статус | Правило использования |
| --- | --- | --- | --- |
| `01_APPROVED_REFERENCES/01_home_approved.png` | 1448×1086 | approved reference | Только композиция главной; не фон/не источник вырезанных фото |
| `01_APPROVED_REFERENCES/05_author_approved_layout.png` | 1024×1536 | approved reference | Только композиция автора; старый портрет/текст заменяются |
| `03_BRAND_REFERENCE/LINAD_LOGO_FINAL_APPROVED.png` | 2172×724 RGB | прежний approved asset, архив | Копия сохранена в `public/assets/linad-logo.png`; UI использует новые варианты brand/ |
| `design/brand/sources/LINAD_preview_light.jpg` | 965×273 RGB | новое утверждённое вложение | Тёмные буквы для светлой темы; подготовлены `brand/linad-logo-light.svg` и `.png` |
| `design/brand/sources/image(20261017-172457).png` | 965×273 RGB | новое утверждённое вложение | Светлые буквы для тёмной темы; подготовлены `brand/linad-logo-dark.svg` и `.png` |
| `05_AUTHOR_PHOTO_APPROVED/danil_author_portrait.png` | 1122×1402 RGBA | approved asset | Точная копия `public/assets/danil-author.png`; аватар футера и портрет автора, object-fit: cover |
| `00_DOCUMENTATION/AUTHOR_STORY_APPROVED.txt` | 4 абзаца, UTF-8 | approved text | В C перенести RU дословно; DE — перевод без изменения фактов |
| `LINAD_CODEX_ASSETS_UPDATE/assets/home/hero.png` | 2048×765 RGBA | **approved asset, integrated** | Побайтная копия `public/assets/home/hero.png`; фото hero с локальным градиентом читаемости |
| `LINAD_CODEX_ASSETS_UPDATE/assets/home/learning-card.png` | 1671×941 RGBA | **approved asset, integrated** | `public/assets/home/learning-card.png`, первая карточка |
| `LINAD_CODEX_ASSETS_UPDATE/assets/home/tutors-card.png` | 1672×941 RGBA | **approved asset, integrated** | `public/assets/home/tutors-card.png`, вторая карточка |
| `LINAD_CODEX_ASSETS_UPDATE/assets/home/telegram-card.png` | 1672×941 RGBA | **approved asset, integrated** | `public/assets/home/telegram-card.png`, третья карточка |
| Фото фона hero/истории/цели автора | — | **source missing** | Встроены в макет; чистых исходников нет. Сохранить места в C |
| `LINAD_CODEX_ASSETS_UPDATE/assets/auth/registration-photo.png` | 1122×1402 RGB | approved in update, deferred | Найдено; вне текущего поручения по главной, не подключалось |
| Прозрачные SVG/PNG логотипа | 965×273 / 3860×1092 | подготовлены по новым вложениям | `public/assets/brand/`; контуры и градиенты по исходникам, см. `design/brand/README.md` |
| favicon | — | optional source missing | Отдельное изображение не создавалось |
| `02_REFERENCE_BOARDS_NEED_CONFIRMATION/02_learning_and_tutors_board.png` | 1536×1024 | candidate | Ориентир функций; горный hero/демоданные не переносить автоматически |
| `02_REFERENCE_BOARDS_NEED_CONFIRMATION/03_tutors_profile_board.png` | 1536×1024 | candidate | Не переносить вымышленные имена/цены/стаж/рейтинги как реальные |
| `02_REFERENCE_BOARDS_NEED_CONFIRMATION/04_user_profile_board.png` | 1536×1024 | candidate | Не переносить вымышленную статистику/адреса; регистрационное фото отклонено |
| `02_04_combined_board.png`, `02_04_comparison_board.png`, `all_boards_contact_sheet.jpg` | 1536×1024 / 1312×1199 / 1000×1295 | candidate/archive overview | Не самостоятельные утверждённые экраны; обзор содержит отклонённые варианты |
| `03_BRAND_REFERENCE/brand_board_LINAD_01..03.png` | каждый 1536×1024 | brand references | Не заменяют финальный логотип |
| `00_DOCUMENTATION/LINAD_MASTER_GUIDE.pdf/.docx` | 9 страниц PDF / DOCX с иллюстрациями | archive guide | Прочитаны; устаревшие сведения перекрываются LATEST_DECISIONS |

Итого: 2 точных макета, 2 пригодных утверждённых изображения для приложения, 8 других PNG и обзорный JPG. Все растры декодируются, размеры проверены. Исходных слоёв макетов, веб-шрифтов и отдельного favicon нет. Системный стек шрифтов не требует внешнего CDN.

Дополнение assets update: найдены 19 отдельных фотографий (4 главной, 8 ситуаций, 6 преподавателей, 1 регистрации) и 2 референса. В этом поручении подключены только 4 фото главной. Новый `references/home-layout-reference.png` имеет тот же SHA-256, что `LINAD/01_APPROVED_REFERENCES/01_home_approved.png`: `39398024C45B96EDBF4F3F72DF9E22193F91CBD699C4F53E6752E4305B010974`. Нового файла логотипа нет; проверены весь распакованный каталог и ZIP. Использован ранее утверждённый логотип. Полная сверка главной — `HOME_IMPLEMENTATION.md`.

До публичного запуска подтвердить права на публикацию исходных фотографий/логотипа и любых новых фото. Наличие файла не является проверкой лицензии. Приложение фазы A не загружает коллажи, скриншоты или отклонённые изображения как assets.

## Дополнение: иконки контактов

`public/assets/contact-icons/`: `telegram.svg`, `github.svg`, `behance.svg`, `linkedin.svg`, `envelope.svg`, `instagram.svg`. Источник: официальный репозиторий [Bootstrap Icons, v1.13.1](https://github.com/twbs/icons/tree/v1.13.1/icons). Лицензия MIT сохранена рядом как `LICENSE.txt`, исходные SVG не изменены. Они используются как монохромные CSS-маски с цветом текста текущей темы, без изменения логотипа LINAD и фотографий. Instagram пока скрыт.
