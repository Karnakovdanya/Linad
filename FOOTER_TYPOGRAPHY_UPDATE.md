# Типографика Footer — 18.10.2026

Изменена только типографика общего Footer в `src/styles/global.css`. Компонент Footer, его подключение в App.tsx, разметка, ссылки, тексты, цвета, фон и фотография не изменялись. Header не изменялся.

| CSS-правило | Desktop | 320 / 390 px | 768 px |
| --- | --- | --- | --- |
| `.footer-nav a` | 20 px / 500 | 16 px / 500 | 19.68 px / 500 |
| `.author-credit strong` | 18 px / 600 | 18 px / 600 | 18 px / 600 |
| `.author-credit-text > span` | 16 px / 400 | 14 px / 400 | 15.84 px / 400 |
| `.copyright` | 16 px / 400 | 14 px / 400 | 15.84 px / 400 |

Desktop здесь — существующая трёхколоночная компоновка от 900 px; на 1024 и 1440 px действуют точные значения из задания. Ниже 900 px сохранена существующая вертикальная компоновка; изменены только локальные font-size. Навигация: `clamp(1rem, calc(.75rem + 1vw), 1.25rem)`. Подпись/copyright: `clamp(.875rem, calc(.75rem + .5vw), 1rem)`. Фактические размеры и веса измерены в браузере.

Сохранены hover `scale(1.05)` и `transform 280ms cubic-bezier(.22,1,.36,1)`, клавиатурный outline, отсутствие подчёркивания, reduced motion. Фото осталось в круге 52×52 px, с прежними cover, center top и scale(1.10).

В существующем `tests/footer-mobile.spec.ts` обновлена устаревшая проверка веса: навигация теперь 500, имя 600; семейство и hover по-прежнему сравниваются с Header. Новые тесты не добавлялись.

Проверки: TypeScript, ESLint и production build успешно; браузерный прогон **6 passed (1.5 мин)**. Матрица: 7 маршрутов (включая 404) × 320/390/768/1024/1440 px × RU/DE/EN × light/dark. Footer одинаковый на всех маршрутах; горизонтального переполнения и наложений нет. Проверены реальные ссылки, hover/возврат, отсутствие подчёркивания, фокус клавиатуры, reduced motion и неподвижность портрета/подписи при hover. Скриншоты — `qa/footer-mobile/`.

Изменённые файлы: `src/styles/global.css`, `tests/footer-mobile.spec.ts`, `CURRENT_REQUIREMENTS.md`, `README.md`, `RESPONSIVE_QA.md`, `FOOTER_TYPOGRAPHY_UPDATE.md`.
