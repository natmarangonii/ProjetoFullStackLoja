const url = 'http://localhost:3000/pelucias';
let produtoAtual = null;

const cadastro = document.getElementById('cadastro');
const detalhes = document.getElementById('detalhes');
const tituloProduto = document.getElementById('tituloProduto');
const imgProduto = document.getElementById('imgProduto');
const nomeEdit = document.getElementById('nomeEdit');
const categoriaEdit = document.getElementById('categoriaEdit');
const precoEdit = document.getElementById('precoEdit');
const imgEdit = document.getElementById('imgEdit');

carregarProdutos();

function carregarProdutos() {
    fetch(url + '/listar')
        .then(res => {
            if (!res.ok) throw new Error('Erro na requisição');
            return res.json();
        })
        .then(data => {
            console.log('Produtos carregados:', data);
            listarCards(data);
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar produtos");
        });
}

function listarCards(lista) {
    const main = document.querySelector('main');
    main.innerHTML = '';

    if (lista.length === 0) {
        main.innerHTML = "<p>Nenhum produto cadastrado</p>";
        return;
    }

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <h3>${p.nome}</h3>
            <img src="${p.imagem}" onerror="this.src='https://via.placeholder.com/200x180?text=Sem+Imagem'">
            <p><b>Categoria:</b> ${formatarCategoria(p.categoria)}</p>
            <p><b>Preço:</b> R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</p>
        `;

        card.onclick = () => abrirProduto(p);
        main.appendChild(card);
    });
}

function formatarCategoria(categoria) {
    switch (categoria) {
        case 'grandes':
            return 'Pelúcias Grandes';
        case 'medias':
            return 'Pelúcias Médias';
        case 'pequenas':
            return 'Pelúcias Pequenas';
        default:
            return categoria;
    }
}

function abrirProduto(p) {
    console.log('Abrindo produto:', p);
    produtoAtual = p;

    tituloProduto.innerText = p.nome;
    imgProduto.src = p.imagem;

    nomeEdit.value = p.nome;
    categoriaEdit.value = p.categoria;
    precoEdit.value = p.preco;
    imgEdit.value = p.imagem;

    detalhes.classList.remove('oculto');
}

imgEdit.addEventListener("input", () => {
    imgProduto.src = imgEdit.value;
});

document.querySelector('#formCad').addEventListener('submit', function (e) {
    e.preventDefault();

    const novo = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        preco: Number(document.getElementById('preco').value),
        imagem: document.getElementById('imagem').value
    };

    console.log("ENVIANDO:", novo);

    fetch(url + '/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
    })
    .then(res => {
        console.log("STATUS:", res.status);
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
    })
    .then(() => {
        alert("Produto salvo");
        cadastro.classList.add('oculto');
        document.getElementById('formCad').reset();
        carregarProdutos();
    })
    .catch(err => {
        console.error("ERRO:", err);
        alert("Erro ao salvar: " + err.message);
    });
});

function salvarEdicao() {
    if (!produtoAtual || !produtoAtual.id) {
        alert("Erro: ID do produto não encontrado");
        return;
    }

    const editado = {
        nome: nomeEdit.value,
        categoria: categoriaEdit.value,
        preco: Number(precoEdit.value),
        imagem: imgEdit.value
    };

    console.log("EDITANDO ID:", produtoAtual.id, editado);

    fetch(url + '/atualizar/' + produtoAtual.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editado)
    })
    .then(res => {
        console.log("STATUS EDIÇÃO:", res.status);
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
    })
    .then(() => {
        alert("Atualizado!");
        detalhes.classList.add('oculto');
        carregarProdutos();
    })
    .catch((err) => {
        console.error("ERRO AO EDITAR:", err);
        alert("Erro ao editar: " + err.message);
    });
}

function excluirProduto() {
    if (!produtoAtual || !produtoAtual.id) {
        alert("Erro: ID do produto não encontrado");
        return;
    }

    if (!confirm("Deseja excluir " + produtoAtual.nome + "?")) return;

    console.log("EXCLUINDO ID:", produtoAtual.id);

    fetch(url + '/excluir/' + produtoAtual.id, {
        method: 'DELETE'
    })
    .then(res => {
        console.log("STATUS EXCLUSÃO:", res.status);
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text); });
        }
        return res.json();
    })
    .then(() => {
        alert("Excluído!");
        detalhes.classList.add('oculto');
        carregarProdutos();
    })
    .catch((err) => {
        console.error("ERRO AO EXCLUIR:", err);
        alert("Erro ao excluir: " + err.message);
    });
}
