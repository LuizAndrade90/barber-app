# AgendaBarber — Design System

Referência visual completa para o desenvolvimento do app. Todos os tokens, componentes e padrões foram extraídos das 10 telas de referência.

---

## 1. Paleta de Cores

### Cores Primárias

| Token              | Hex       | Uso                                      |
|--------------------|-----------|------------------------------------------|
| `primary`          | `#25d466` | Botões, links, ícones ativos, destaques  |
| `primary-dark`     | `#1da851` | Hover de botões, textos sobre fundo claro |
| `primary-hover`    | `#20bd5a` | Estado hover alternativo                 |

### Gradiente Splash

```
background: linear-gradient(to bottom, #25D366, #128C7E)
```

### Backgrounds

| Token              | Hex       | Uso                          |
|--------------------|-----------|------------------------------|
| `background-light` | `#f6f8f7` | Fundo principal (light mode) |
| `background-dark`  | `#122017` | Fundo principal (dark mode)  |

### Superfícies

| Token           | Hex       | Uso                            |
|-----------------|-----------|--------------------------------|
| `surface-light` | `#ffffff` | Cards, modais, sidebar (light) |
| `surface-dark`  | `#1a2e22` | Cards, modais, sidebar (dark)  |

### Cores de Status

| Status       | Background (light)                  | Texto                  | Uso                        |
|--------------|-------------------------------------|------------------------|----------------------------|
| Confirmado   | `bg-primary/20`                     | `text-primary-dark`    | Badge em agendamentos      |
| Pendente     | `bg-orange-100`                     | `text-orange-700`      | Badge, ações pendentes     |
| Cancelado    | `bg-red-50`                         | `text-red-500`         | Badge em histórico         |
| No-show      | `bg-red-500/10`                     | `text-red-500`         | Badge, KPI card            |
| Concluído    | `bg-green-50`                       | `text-green-700`       | Badge em histórico         |
| Novo         | `bg-green-50`                       | `text-green-700`       | Badge em lista de clientes |
| VIP          | `bg-yellow-400` / `text-primary`    | `text-yellow-900`      | Badge no perfil do cliente |

### Cores de Status (dark mode)

| Status       | Background                          | Texto                  |
|--------------|-------------------------------------|------------------------|
| Confirmado   | `bg-primary/20`                     | `text-primary`         |
| Pendente     | `bg-orange-900/30`                  | `text-orange-400`      |
| Cancelado    | `bg-red-900/20`                     | `text-red-400`         |
| Concluído    | `bg-green-900/30`                   | `text-green-400`       |

### Cores Neutras (do Tailwind)

Usamos a escala padrão do Tailwind (`gray`, `slate`) para textos, bordas e divisores:

- Texto principal: `text-gray-900` / `dark:text-white`
- Texto secundário: `text-gray-500` / `dark:text-gray-400`
- Texto terciário: `text-gray-400` / `dark:text-gray-500`
- Bordas: `border-gray-100` / `dark:border-gray-800`
- Divisores: `divide-gray-100` / `dark:divide-gray-800`

---

## 2. Tipografia

### Fonte

```
font-family: 'Inter', sans-serif;
```

**Pesos disponíveis:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Hierarquia

| Elemento         | Classe Tailwind                                  | Uso                                |
|------------------|--------------------------------------------------|------------------------------------|
| Título de página | `text-2xl font-bold` ou `text-3xl font-bold`     | "Olá, João", "Clientes", "Configurações" |
| Título de seção  | `text-xl font-bold`                              | "Novo Agendamento", títulos de modal |
| Subtítulo        | `text-lg font-bold`                              | Nomes em cards, valores grandes    |
| Label de grupo   | `text-xs font-semibold uppercase tracking-wider`  | "Barbearia", "A", "B" em listas   |
| Label de campo   | `text-sm font-medium`                            | Labels de formulário               |
| Corpo            | `text-sm`                                        | Texto geral, descrições            |
| Caption          | `text-xs`                                        | Metadados, datas, contadores       |
| Micro            | `text-[10px]`                                    | Labels de bottom nav, versão       |
| Badge            | `text-xs font-bold uppercase tracking-wide`       | Badges de status                   |

---

## 3. Border Radius

| Token     | Valor     | Tailwind       | Uso                                    |
|-----------|-----------|----------------|----------------------------------------|
| default   | `0.5rem`  | `rounded`      | Badges, botões pequenos                |
| `md`      | `0.75rem` | `rounded-md`   | Tags, chips                            |
| `lg`      | `1rem`    | `rounded-lg`   | Inputs, cards internos, buttons        |
| `xl`      | `1.5rem`  | `rounded-xl`   | Cards, modais, containers principais   |
| `2xl`     | `2rem`    | `rounded-2xl`  | Modais grandes, bottom sheets          |
| `3xl`     | `3rem`    | `rounded-3xl`  | Frame do device na splash              |
| `full`    | `9999px`  | `rounded-full` | Avatares, pills, toggles, FAB         |

---

## 4. Sombras

| Token  | Valor CSS                                                                  | Uso                              |
|--------|---------------------------------------------------------------------------|----------------------------------|
| `sm`   | Tailwind default `shadow-sm`                                              | Cards sutis, header              |
| `soft` | `0 4px 20px -2px rgba(0, 0, 0, 0.05)`                                    | Cards de agendamento, timeline   |
| `glow` | `0 4px 20px 0px rgba(37, 212, 102, 0.3)`                                 | Dia ativo, FAB, botão principal  |
| `lg`   | Tailwind default `shadow-lg`                                              | Modais, FAB                      |
| `2xl`  | Tailwind default `shadow-2xl`                                             | Device frames, modais overlay    |

Sombra especial para botão principal:
```
shadow-lg shadow-primary/30
```

---

## 5. Iconografia

### Biblioteca

**Material Icons Round** (`material-icons-round`)

CDN:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
```

### Ícones por Contexto

| Contexto           | Ícone                    | Uso                          |
|--------------------|--------------------------|------------------------------|
| Agenda             | `calendar_today`         | Nav, cards de data           |
| Clientes           | `people`                 | Nav, sidebar                 |
| Serviços           | `content_cut`            | Nav, sidebar, cards          |
| Financeiro         | `attach_money`           | Nav, sidebar, KPIs           |
| Configurações      | `settings`               | Nav, sidebar                 |
| Relatórios         | `bar_chart`              | Nav, sidebar                 |
| Adicionar          | `add`                    | FAB                          |
| Voltar             | `arrow_back`             | Header de navegação          |
| Mais opções        | `more_vert`              | Menu contextual              |
| Buscar             | `search`                 | Campo de busca               |
| Filtro             | `tune`                   | Botão de filtro              |
| Notificações       | `notifications`          | Header                       |
| Email              | `mail_outline`           | Input de email               |
| Senha              | `lock_outline`           | Input de senha               |
| Visibilidade       | `visibility_off`         | Toggle de senha              |
| WhatsApp           | SVG customizado          | Botão de contato             |
| Telefone           | `phone`                  | Botão de contato             |
| Horário            | `schedule`               | Cards de horário             |
| Evento             | `event`                  | Cards de data                |
| Confirmar          | `check` / `check_circle` | Ações de confirmação         |
| Cancelar/Fechar    | `close`                  | Fechar modal, rejeitar       |
| Bloquear           | `block`                  | Cancelar agendamento         |
| Pausa/Almoço       | `restaurant`             | Slot bloqueado               |
| Loja               | `storefront`             | Dados da barbearia           |
| Pessoa             | `person` / `person_outline` | Perfil, registro         |
| Adicionar pessoa   | `person_add`             | FAB em lista de clientes     |
| Tendência          | `trending_up`            | Indicadores de crescimento   |
| Estrela            | `star`                   | Badge VIP                    |
| Troféu             | `emoji_events`           | Badge de visitas             |
| Sair               | `logout`                 | Botão de logout              |
| Avançar            | `arrow_forward`          | CTA em botões                |
| Chevron direita    | `chevron_right`          | Indicador de navegação       |

---

## 6. Componentes

### 6.1 Botões

#### Primário
```html
<button class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl
  shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
  Texto do Botão
</button>
```

#### Primário com ícone
```html
<button class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl
  shadow-lg shadow-primary/30 active:scale-[0.98] transition-all
  flex items-center justify-center gap-2 group">
  Confirmar Agendamento
  <span class="material-icons-round text-xl group-hover:translate-x-1 transition-transform">
    arrow_forward
  </span>
</button>
```

#### Secundário / Outline
```html
<button class="w-full flex items-center justify-center px-4 py-3
  border border-gray-200 dark:border-gray-700 rounded-lg
  bg-white dark:bg-transparent text-sm font-medium
  text-gray-700 dark:text-gray-200
  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
  Texto
</button>
```

#### Destrutivo (outline)
```html
<button class="w-full bg-transparent hover:bg-red-50 text-red-500
  font-medium py-3 px-6 rounded-lg transition-colors
  border border-transparent hover:border-red-100
  flex items-center justify-center gap-2">
  <span class="material-icons-round text-lg">person_off</span>
  Marcar No-Show
</button>
```

#### FAB (Floating Action Button)
```html
<button class="fixed right-6 bottom-20 md:bottom-8 z-40
  bg-primary hover:bg-green-500 text-white rounded-2xl p-4
  shadow-glow flex items-center gap-2 transition-all
  transform hover:scale-105 active:scale-95 group">
  <span class="material-icons-round text-2xl group-hover:rotate-90 transition-transform">
    add
  </span>
  <span class="font-bold pr-1 hidden md:inline">Novo Agendamento</span>
</button>
```

#### Botão de ícone (circular)
```html
<button class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700
  text-slate-600 dark:text-slate-300 flex items-center justify-center
  hover:bg-slate-200 dark:hover:bg-slate-600 transition shadow-sm hover:shadow-md">
  <span class="material-icons-round text-xl">phone</span>
</button>
```

#### Ação rápida (confirmar/rejeitar pequenos)
```html
<!-- Confirmar -->
<button class="w-8 h-8 flex items-center justify-center rounded-full
  bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
  <span class="material-icons-round text-sm">check</span>
</button>
<!-- Rejeitar -->
<button class="w-8 h-8 flex items-center justify-center rounded-full
  bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
  <span class="material-icons-round text-sm">close</span>
</button>
```

#### Filter Pill
```html
<!-- Ativo -->
<button class="px-5 py-2 rounded-full bg-gray-900 dark:bg-white
  text-white dark:text-gray-900 font-medium text-sm whitespace-nowrap shadow-md">
  Todos
</button>
<!-- Inativo -->
<button class="px-5 py-2 rounded-full bg-white dark:bg-gray-800
  text-gray-600 dark:text-gray-300
  border border-gray-200 dark:border-gray-700
  font-medium text-sm hover:border-primary hover:text-primary
  transition-colors whitespace-nowrap">
  Agendados
</button>
```

### 6.2 Inputs

#### Campo com ícone
```html
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-icons-round text-gray-400 text-xl">mail_outline</span>
  </div>
  <input type="email" placeholder="E-mail"
    class="block w-full pl-10 pr-3 py-3
    border border-gray-200 dark:border-gray-700 rounded-xl
    bg-gray-50 dark:bg-gray-800/50
    text-gray-900 dark:text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all sm:text-sm" />
</div>
```

#### Campo de senha (com toggle de visibilidade)
```html
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-icons-round text-gray-400 text-xl">lock_outline</span>
  </div>
  <input type="password" placeholder="Senha"
    class="block w-full pl-10 pr-10 py-3
    border border-gray-200 dark:border-gray-700 rounded-xl
    bg-gray-50 dark:bg-gray-800/50
    text-gray-900 dark:text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all sm:text-sm" />
  <button class="absolute inset-y-0 right-0 pr-3 flex items-center
    text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
    <span class="material-icons-round text-xl">visibility_off</span>
  </button>
</div>
```

#### Campo de busca
```html
<div class="relative flex-1">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-icons-round text-gray-400 text-xl">search</span>
  </div>
  <input type="text" placeholder="Buscar cliente..."
    class="block w-full pl-10 pr-3 py-3
    border border-gray-200 dark:border-gray-700 rounded-xl
    bg-background-light dark:bg-background-dark
    text-gray-900 dark:text-white placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    sm:text-sm transition-shadow" />
</div>
```

### 6.3 Cards

#### Card de Estatística
```html
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-xl
  border border-gray-100 dark:border-gray-800 shadow-sm">
  <div class="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total</div>
  <div class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">12</div>
  <div class="text-xs text-green-600 font-medium mt-1 flex items-center">
    <span class="material-icons-round text-sm mr-1">trending_up</span> +2 hoje
  </div>
</div>
```

#### Card de Estatística (destaque com borda lateral)
```html
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-xl
  border-l-4 border-l-primary shadow-soft">
  <div class="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Confirmados</div>
  <div class="text-2xl md:text-3xl font-bold text-primary">8</div>
  <div class="text-xs text-gray-400 mt-1">66% do dia</div>
</div>
```

#### Card de Agendamento (confirmado)
```html
<div class="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-5
  shadow-soft border-l-4 border-l-primary
  flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div class="flex items-center gap-4">
    <!-- Avatar -->
    <img class="w-12 h-12 rounded-full object-cover" src="..." alt="..." />
    <div>
      <h3 class="font-bold text-gray-900 dark:text-white">Carlos Silva</h3>
      <div class="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
        <span class="material-icons-round text-sm">content_cut</span>
        <span>Corte + Barba</span>
        <span class="text-gray-300">&bull;</span>
        <span>45 min</span>
      </div>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <div class="text-right mr-4">
      <span class="block text-sm font-semibold">R$ 65,00</span>
      <span class="text-xs text-gray-400">Pix</span>
    </div>
    <span class="px-3 py-1 rounded-full bg-primary/20 text-primary-dark
      text-xs font-bold uppercase tracking-wide">
      Confirmado
    </span>
  </div>
</div>
```

#### Card de Cliente
```html
<div class="group bg-white dark:bg-surface-dark
  border border-gray-100 dark:border-gray-800 rounded-xl p-4
  flex items-center justify-between
  hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
  <div class="flex items-center gap-4">
    <!-- Avatar Iniciais -->
    <div class="h-12 w-12 rounded-full bg-primary/10
      flex items-center justify-center text-primary font-bold text-lg">
      AJ
    </div>
    <div>
      <h4 class="font-semibold text-gray-900 dark:text-white">Alberto Junior</h4>
      <p class="text-sm text-gray-500 mb-0.5">(47) 98823-4122</p>
      <div class="flex items-center text-xs text-gray-400 font-medium">
        <span>1 visita &bull; Última: Ontem</span>
      </div>
    </div>
  </div>
  <span class="material-icons-round text-gray-300 group-hover:text-primary transition-colors">
    chevron_right
  </span>
</div>
```

#### Card de Serviço (selecionável)
```html
<!-- Selecionado -->
<div class="relative flex items-start p-4
  bg-primary/10 border-2 border-primary rounded-xl cursor-pointer shadow-sm">
  <div class="flex-1">
    <h4 class="font-bold text-gray-900 dark:text-white mb-1">Corte + Barba</h4>
    <div class="flex items-center gap-3 text-sm text-gray-500">
      <span class="flex items-center gap-1">
        <span class="material-icons-round text-base">schedule</span> 45 min
      </span>
      <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
      <span class="font-medium text-primary">R$ 50,00</span>
    </div>
  </div>
  <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
    <span class="material-icons-round text-white text-sm">check</span>
  </div>
</div>

<!-- Não selecionado -->
<div class="relative flex items-start p-4
  bg-surface-light border border-gray-200 rounded-xl cursor-pointer
  hover:border-primary/50 hover:bg-gray-50 transition-all">
  <div class="flex-1">
    <h4 class="font-bold text-gray-900 dark:text-white mb-1">Corte Social</h4>
    <div class="flex items-center gap-3 text-sm text-gray-500">
      <span class="flex items-center gap-1">
        <span class="material-icons-round text-base">schedule</span> 30 min
      </span>
      <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
      <span class="font-medium text-gray-700">R$ 35,00</span>
    </div>
  </div>
  <div class="w-6 h-6 rounded-full border-2 border-gray-300"></div>
</div>
```

#### Item de Configuração
```html
<button class="w-full flex items-center justify-between p-4
  hover:bg-gray-50 transition-colors group">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full bg-primary/10
      flex items-center justify-center text-primary">
      <span class="material-icons-round text-lg">storefront</span>
    </div>
    <span class="text-gray-900 font-medium group-hover:text-primary-dark transition-colors">
      Dados da Barbearia
    </span>
  </div>
  <span class="material-icons-round text-gray-400 text-xl">chevron_right</span>
</button>
```

### 6.4 Badges / Pills

#### Badge de Status
```html
<!-- Confirmado -->
<span class="px-3 py-1 rounded-full bg-primary/20 text-primary-dark
  text-xs font-bold uppercase tracking-wide">
  Confirmado
</span>

<!-- Pendente -->
<span class="px-3 py-1 rounded-full bg-orange-100 text-orange-700
  dark:bg-orange-900/30 dark:text-orange-400
  text-xs font-bold uppercase tracking-wide">
  Pendente
</span>

<!-- Concluído -->
<span class="text-xs font-bold text-green-600 bg-green-50
  dark:text-green-400 dark:bg-green-900/30
  px-2 py-1 rounded-md">
  Concluído
</span>

<!-- Cancelado -->
<span class="text-xs font-bold text-red-500 bg-red-50
  dark:text-red-400 dark:bg-red-900/20
  px-2 py-1 rounded-md">
  Cancelado
</span>
```

#### Badge VIP
```html
<span class="flex items-center gap-1 text-primary text-xs mr-2">
  <span class="material-icons-round" style="font-size: 12px;">star</span> VIP
</span>
```

#### Badge "Novo"
```html
<span class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400
  px-1.5 py-0.5 rounded text-xs">
  Novo
</span>
```

#### Badge de Plano
```html
<span class="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-md uppercase tracking-wide">
  Pro
</span>
```

### 6.5 Avatares

#### Avatar com imagem
```html
<img class="w-12 h-12 rounded-full object-cover" src="..." alt="..." />
```

#### Avatar com iniciais
```html
<div class="h-12 w-12 rounded-full bg-primary/10
  flex items-center justify-center text-primary font-bold text-lg">
  CS
</div>
```

Cores de fundo para iniciais (variação por cliente):
- `bg-primary/10 text-primary`
- `bg-orange-100 text-orange-600`
- `bg-blue-100 text-blue-600`
- `bg-purple-100 text-purple-600`
- `bg-teal-100 text-teal-600`

#### Avatar de profissional (selecionável)
```html
<!-- Selecionado -->
<button class="flex flex-col items-center gap-2">
  <div class="relative">
    <div class="w-14 h-14 rounded-full p-0.5
      bg-gradient-to-tr from-primary to-emerald-300 shadow-glow">
      <img class="w-full h-full rounded-full object-cover
        border-2 border-surface-light" src="..." alt="..." />
    </div>
    <div class="absolute bottom-0 right-0 w-4 h-4 bg-primary
      border-2 border-surface-light rounded-full
      flex items-center justify-center">
      <span class="material-icons-round text-[10px] text-white">check</span>
    </div>
  </div>
  <span class="text-xs font-medium text-primary">Você</span>
</button>

<!-- Não selecionado -->
<button class="flex flex-col items-center gap-2 group">
  <div class="w-14 h-14 rounded-full p-0.5
    bg-gray-200 dark:bg-gray-700 group-hover:bg-primary/50 transition-colors">
    <img class="w-full h-full rounded-full object-cover
      border-2 border-surface-light grayscale group-hover:grayscale-0 transition-all"
      src="..." alt="..." />
  </div>
  <span class="text-xs font-medium text-gray-500
    group-hover:text-gray-900 transition-colors">
    Carlos
  </span>
</button>
```

### 6.6 Toggle Switch

```html
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" checked />
  <div class="w-11 h-6 bg-gray-200 rounded-full peer
    peer-checked:after:translate-x-full peer-checked:after:border-white
    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
    after:bg-white after:border-gray-300 after:border after:rounded-full
    after:h-5 after:w-5 after:transition-all
    peer-checked:bg-primary">
  </div>
</label>
```

### 6.7 Checkbox Customizado

```html
<label class="flex items-start gap-3 cursor-pointer">
  <div class="relative flex items-center pt-0.5">
    <input type="checkbox"
      class="peer h-5 w-5 cursor-pointer appearance-none rounded-md
      border border-gray-300 dark:border-gray-600
      bg-white dark:bg-gray-800 transition-all
      checked:border-primary checked:bg-primary
      hover:border-primary" />
    <span class="material-icons-round absolute left-1/2 top-1/2
      -translate-x-1/2 -translate-y-[40%] text-base text-white
      opacity-0 peer-checked:opacity-100 pointer-events-none">
      check
    </span>
  </div>
  <span class="text-sm text-gray-600 leading-tight">
    Texto do checkbox
  </span>
</label>
```

### 6.8 Divider com Texto

```html
<div class="relative my-8">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
  </div>
  <div class="relative flex justify-center text-sm">
    <span class="px-2 bg-white dark:bg-surface-dark text-gray-500">ou</span>
  </div>
</div>
```

### 6.9 Slot de Horário Disponível

```html
<div class="group flex gap-4 items-start">
  <div class="w-16 pt-3 text-right">
    <span class="text-sm font-semibold text-gray-400
      group-hover:text-primary transition-colors">
      09:00
    </span>
  </div>
  <div class="flex-1">
    <button class="w-full border-2 border-dashed border-gray-200 dark:border-gray-700
      rounded-xl p-4 flex items-center justify-center gap-2
      text-gray-400 hover:text-primary hover:border-primary
      hover:bg-primary/5 transition-all">
      <span class="material-icons-round text-xl">add_circle_outline</span>
      <span class="font-medium">Agendar horário</span>
    </button>
  </div>
</div>
```

### 6.10 Slot Bloqueado (Pausa)

```html
<div class="flex gap-4 items-center">
  <div class="w-16 text-right">
    <span class="text-sm font-medium text-gray-400">12:00</span>
  </div>
  <div class="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3
    flex items-center justify-center gap-2 text-gray-400
    border border-gray-200 dark:border-gray-700/50">
    <span class="material-icons-round text-lg">restaurant</span>
    <span class="font-medium text-sm">Almoço (Pausa)</span>
  </div>
</div>
```

### 6.11 Progress Bar

```html
<div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
  <div class="bg-primary h-2 rounded-full" style="width: 90%"></div>
</div>
```

### 6.12 Info Grid (Detalhes do Agendamento)

```html
<div class="bg-background-light dark:bg-background-dark p-4 rounded-xl
  flex flex-col justify-center items-start
  border border-gray-200 dark:border-gray-700/50">
  <div class="flex items-center gap-2 mb-2 text-gray-500">
    <span class="material-icons-round text-lg">schedule</span>
    <span class="text-xs font-medium uppercase tracking-wide">Horário</span>
  </div>
  <span class="text-xl font-bold text-gray-900 dark:text-white">09:30</span>
</div>
```

---

## 7. Layout & Navegação

### 7.1 Seletor de Semana

```html
<!-- Dia inativo -->
<button class="flex flex-col items-center justify-center p-3 w-16 md:w-auto h-20 md:h-24
  rounded-xl bg-surface-light dark:bg-surface-dark text-gray-500
  hover:bg-gray-50 dark:hover:bg-gray-800 transition-all
  border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
  <span class="text-xs font-medium uppercase mb-1">Dom</span>
  <span class="text-lg font-semibold">10</span>
</button>

<!-- Dia ativo -->
<button class="flex flex-col items-center justify-center p-3 w-16 md:w-auto h-20 md:h-24
  rounded-xl bg-primary text-white shadow-glow transform scale-105 transition-all">
  <span class="text-xs font-medium uppercase mb-1 opacity-90">Ter</span>
  <span class="text-2xl font-bold">12</span>
  <div class="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
</button>
```

### 7.2 Sidebar Desktop

- Largura: `w-64` (256px)
- Posição: `fixed left-0 top-0 h-screen`
- Visibilidade: `hidden md:flex`
- Conteúdo principal: `md:ml-64`

#### Item de nav ativo
```html
<a class="flex items-center gap-4 px-4 py-3
  bg-primary/10 text-primary rounded-xl font-medium transition-colors" href="#">
  <span class="material-icons-round">calendar_today</span>
  Agenda
</a>
```

#### Item de nav inativo
```html
<a class="flex items-center gap-4 px-4 py-3
  text-gray-500 dark:text-gray-400
  hover:bg-gray-50 dark:hover:bg-gray-800
  rounded-xl font-medium transition-colors" href="#">
  <span class="material-icons-round">people</span>
  Clientes
</a>
```

### 7.3 Bottom Navigation Mobile

- Visibilidade: `md:hidden`
- Posição: `fixed bottom-0 left-0 w-full`
- Background: `bg-surface-light dark:bg-surface-dark`
- Borda: `border-t border-gray-200 dark:border-gray-800`

#### Tabs

| Ordem | Ícone            | Label      |
|-------|------------------|------------|
| 1     | `calendar_today` | Agenda     |
| 2     | `people`         | Clientes   |
| 3     | FAB central      | (+)        |
| 4     | `attach_money`   | Caixa      |
| 5     | `settings`       | Ajustes    |

#### Tab ativa
```html
<a class="flex flex-col items-center gap-1 p-2 text-primary" href="#">
  <span class="material-icons-round">calendar_today</span>
  <span class="text-[10px] font-medium">Agenda</span>
</a>
```

#### Tab inativa
```html
<a class="flex flex-col items-center gap-1 p-2
  text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
  <span class="material-icons-round">people</span>
  <span class="text-[10px] font-medium">Clientes</span>
</a>
```

### 7.4 Bottom Sheet / Modal

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-10"></div>

<!-- Sheet -->
<main class="relative z-10 w-full max-w-md h-[85vh]
  bg-surface-light dark:bg-surface-dark
  rounded-t-2xl md:rounded-2xl shadow-2xl
  flex flex-col overflow-hidden
  border border-gray-100 dark:border-gray-700/30">

  <!-- Handle Bar -->
  <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6
    cursor-grab active:cursor-grabbing"></div>

  <!-- Conteúdo scroll -->
  <div class="flex-1 overflow-y-auto px-6 pb-24">
    ...
  </div>

  <!-- Footer sticky -->
  <footer class="absolute bottom-0 left-0 right-0
    bg-surface-light dark:bg-surface-dark
    border-t border-gray-100 dark:border-gray-700/50
    p-6 z-30">
    ...
  </footer>
</main>
```

### 7.5 Header de Página com Busca (Sticky)

```html
<header class="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/95
  backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4">
  <div class="flex justify-between items-end mb-4">
    <div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Clientes</h2>
      <p class="text-sm font-medium text-gray-500 mt-1">47 clientes cadastrados</p>
    </div>
  </div>
  <!-- Search bar -->
</header>
```

---

## 8. Animações & Transições

| Padrão               | Classe Tailwind                            | Uso                         |
|----------------------|--------------------------------------------|-----------------------------|
| Transição de cor     | `transition-colors`                        | Botões, links, hover states |
| Transição completa   | `transition-all`                           | Cards com múltiplas mudanças|
| Escala ao pressionar | `active:scale-[0.98]`                      | Botões principais           |
| Escala ao hover      | `hover:scale-105`                          | FAB, ícones                 |
| Translate ao hover   | `group-hover:translate-x-1`               | Setas em CTAs               |
| Rotação ao hover     | `group-hover:rotate-90`                    | Ícone + no FAB              |
| Grayscale toggle     | `grayscale group-hover:grayscale-0`        | Avatares não selecionados   |
| Pulse (splash)       | Keyframe customizado `pulse-scale`         | Logo na splash screen       |
| Spinner              | Keyframe `spin` com border parcial         | Loading na splash           |

---

## 9. Breakpoints & Responsividade

| Breakpoint | Tailwind | Comportamento                                       |
|------------|----------|-----------------------------------------------------|
| < 768px    | default  | Mobile: bottom nav, scroll horizontal, cards empilhados |
| >= 768px   | `md:`    | Sidebar visível, grid de colunas, FAB com texto      |
| >= 1024px  | `lg:`    | Grids de 3+ colunas, layout otimizado para desktop   |

---

## 10. Configuração Tailwind Consolidada

```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#25d466",
        "primary-dark": "#1da851",
        "primary-hover": "#20bd5a",
        "background-light": "#f6f8f7",
        "background-dark": "#122017",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2e22",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 4px 20px 0px rgba(37, 212, 102, 0.3)",
      },
    },
  },
}
```

---

## 11. Telas do App

| #  | Tela                     | Rota sugerida              | Layout           |
|----|--------------------------|----------------------------|------------------|
| 1  | Splash Screen            | `/`                        | Fullscreen       |
| 2  | Login                    | `/login`                   | Centralizado     |
| 3  | Criar Conta              | `/registro`                | Mobile scroll    |
| 4  | Dashboard / Agenda       | `/agenda`                  | Sidebar + Nav    |
| 5  | Novo Agendamento         | Modal sobre `/agenda`      | Bottom sheet     |
| 6  | Detalhes do Agendamento  | Modal sobre `/agenda`      | Modal overlay    |
| 7  | Lista de Clientes        | `/clientes`                | Sidebar + Nav    |
| 8  | Detalhes do Cliente      | `/clientes/[id]`           | Sidebar + Nav    |
| 9  | Relatórios               | `/relatorios`              | Sidebar + Nav    |
| 10 | Configurações            | `/configuracoes`           | Sidebar + Nav    |
