# Деплой: Cloud Run + Supabase + Cloudflare R2

Push в `main` запускает [deploy.yml](../.github/workflows/deploy.yml): сборка образа, публикация в Artifact Registry, деплой на Cloud Run (`europe-central2`, `min-instances=0`).
Ниже одноразовая настройка, которую нужно сделать руками до первого деплоя.

## 1. Supabase

1. Создайте проект в регионе `eu-central-1` (Франкфурт, ближайший к Варшаве).
2. **Connect → Transaction pooler**: скопируйте строку вида
   `postgresql://postgres.<ref>:<пароль>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`.
   Это значение `DATABASE_URL` для Cloud Run. Прямой хост `db.<ref>.supabase.co` на Free доступен только по IPv6, а Cloud Run исходящий IPv6 не поддерживает.
3. Пароль в URL должен быть URL-закодирован и без запятых (ограничение `env_vars` в deploy-cloudrun).
4. Восстановите бэкап. С домашней машины без IPv6 используйте **Session pooler** (порт 5432 на pooler-хосте):

   ```bash
   pg_restore --no-owner --no-privileges -d "postgresql://postgres.<ref>:<пароль>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" backup.dump
   ```

   Для SQL-дампа: `psql "<та же строка>" -f backup.sql`.

Схема приходит из бэкапа, поэтому `DB_SYNCHRONIZE=false` (задано в workflow).

Free-проект Supabase приостанавливается после недели без активности.

## 2. Cloudflare R2

1. Создайте бакет.
2. Публичный доступ: **Settings → Custom Domains** (например `cdn.example.com`). Домен `r2.dev` только для тестов, у него ограничения по запросам.
3. **R2 → Manage API tokens**: токен с правом *Object Read & Write* только на этот бакет. Сохраните Access Key ID и Secret.
4. `R2_ENDPOINT` = `https://<account_id>.r2.cloudflarestorage.com`.

### Перенос существующих картинок

В БД хранится только имя файла, поэтому файлы нужно залить в бакет **с теми же именами**, записи править не придётся.

```bash
# Вариант 1: aws cli
export AWS_ACCESS_KEY_ID=<R2 key> AWS_SECRET_ACCESS_KEY=<R2 secret> AWS_DEFAULT_REGION=auto
aws s3 sync ./uploads s3://<bucket> --endpoint-url https://<account_id>.r2.cloudflarestorage.com

# Вариант 2: rclone (после `rclone config`, тип s3, provider Cloudflare)
rclone copy ./uploads r2:<bucket> --progress
```

Заливка идёт без `Cache-Control` и с определяемым Content-Type. Для старых файлов это нормально.

## 3. Google Cloud

```bash
export PROJECT_ID=vibe-barbershop-489818
export REGION=europe-central2
export GITHUB_REPO=AnToxa566/vibe-api
gcloud config set project $PROJECT_ID

gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com iam.googleapis.com

# Репозиторий образов
gcloud artifacts repositories create vibe --repository-format=docker --location=$REGION

# Аккаунт, под которым работает приложение (без ролей: приложению GCP не нужен)
gcloud iam service-accounts create vibe-api-runtime

# Аккаунт, под которым деплоит GitHub
gcloud iam service-accounts create github-deployer
DEPLOYER=github-deployer@$PROJECT_ID.iam.gserviceaccount.com
RUNTIME=vibe-api-runtime@$PROJECT_ID.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding $PROJECT_ID --member=serviceAccount:$DEPLOYER --role=roles/run.admin
gcloud projects add-iam-policy-binding $PROJECT_ID --member=serviceAccount:$DEPLOYER --role=roles/artifactregistry.writer
gcloud iam service-accounts add-iam-policy-binding $RUNTIME \
  --member=serviceAccount:$DEPLOYER --role=roles/iam.serviceAccountUser

# Workload Identity Federation для GitHub
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub Actions"
gcloud iam workload-identity-pools providers create-oidc vibe-api \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '$GITHUB_REPO'"

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding $DEPLOYER \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$GITHUB_REPO"

# Значение для секрета GCP_WORKLOAD_IDENTITY_PROVIDER
echo "projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/vibe-api"
```

## 4. GitHub (Settings → Secrets and variables → Actions)

**Secrets**

| Имя | Значение |
|---|---|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | вывод последней команды выше |
| `GCP_SERVICE_ACCOUNT` | `github-deployer@vibe-barbershop-489818.iam.gserviceaccount.com` |
| `DATABASE_URL` | Transaction-pooler URL из Supabase |
| `JWT_SECRET` | длинная случайная строка |
| `R2_ACCESS_KEY_ID` | ключ R2 |
| `R2_SECRET_ACCESS_KEY` | секрет R2 |

**Variables**

| Имя | Значение |
|---|---|
| `R2_ENDPOINT` | `https://<account_id>.r2.cloudflarestorage.com` |
| `R2_BUCKET` | имя бакета |
| `STORAGE_PUBLIC_URL` | `https://cdn.example.com` |

## 5. Первый деплой

Запустите workflow вручную (**Actions → Deploy to Cloud Run → Run workflow**) или сделайте push в `main`. URL сервиса выводится в последнем шаге. Затем в фронтенде:

- смените базовый URL API на адрес Cloud Run;
- используйте `imgPath` и `path` из ответов как готовую ссылку, без добавления префикса.

## Локальная разработка

Скопируйте `.env.example` в `.env`. Для базы либо оставьте `DB_*` (локальный Postgres), либо задайте `DATABASE_URL`. Для загрузки картинок нужны реальные `R2_*` (лучше отдельный dev-бакет). При первом запуске на пустой локальной базе поставьте `DB_SYNCHRONIZE=true`, чтобы создать схему, потом выключите.
