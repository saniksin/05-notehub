# 05-notehub

Застосунок NoteHub для зберігання, створення, видалення та пошуку нотаток (React + TypeScript + Vite + TanStack Query + Formik + Yup) з бекендом [NoteHub API](https://notehub-public.goit.study/api/docs).

## Налаштування

У корені проєкту створіть файл `.env` з персональним токеном NoteHub:

```
VITE_NOTEHUB_TOKEN=ваш_токен
```

На Vercel додайте цю ж змінну в **Settings → Environment Variables**.

## Запуск

```bash
npm install
npm run dev
```

## Скрипти

- `npm run dev` — сервер розробки
- `npm run build` — перевірка типів і production-збірка
- `npm run lint` — перевірка коду (oxlint)
- `npm run format` — форматування Prettier
