# Movie Explorer

Dashboard cinematográfico feito em HTML, CSS e JavaScript puro. Abra
`index.html` por um servidor local (módulos ES precisam de HTTP) para explorar
a interface.

## Executar localmente

Na pasta do projeto, inicie um servidor HTTP:

```powershell
python -m http.server 8080
```

Depois abra [http://localhost:8080](http://localhost:8080).

## Funcionalidades

- Navegação responsiva entre dashboard, explorar, biblioteca, favoritos,
  avaliações, estatísticas e configurações.
- Busca no catálogo demonstrativo e busca TMDB após inserir uma chave de API v3
  em Configurações e pressionar Enter na busca.
- Filtros de ano, gênero e nota mínima atualizam resultados, indicadores e
  gráficos; há opções de ordenação e limpeza dos filtros.
- Favoritos, biblioteca, assistidos, avaliações, configurações e atividade
  persistem em `localStorage`.
- Detalhes dos filmes em modal com ações para favoritar, adicionar à biblioteca,
  marcar como assistido e avaliar.
- Gráficos responsivos com Chart.js na página Estatísticas.

## Dados e integrações

### Catálogo demonstrativo

O catálogo inicial contém dados de demonstração, identificados na interface.
Os dados locais continuam funcionando sem integrações externas.

### TMDB

A chave TMDB fica salva somente neste navegador. Para uso em produção, utilize
um backend ou proxy para proteger as credenciais.

### Back4App

`api.js` contém os métodos de consulta TMDB e a fábrica cliente Parse/Back4App.
`biblioteca.js` oferece um adaptador CRUD de referência; a sincronização remota
ainda depende da configuração e das regras no Back4App.

## Dependências visuais

Chart.js, Lucide e as fontes Google são carregados por CDN. Sem conexão, esses
recursos externos podem não carregar.
