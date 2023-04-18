const Axios = require("../config/Ravex.js");

const Ravex = {
  periodoLongo: async (datainicial, datafinal, nf) => {
    const teste = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const testemap = teste.map(async (item) => {
      const dadosmap = await Axios.get(
        `api/nota-fiscal/obter-notas-fiscais-por-periodo?skip=${item}&take=1000&dataHoraInicio=${datainicial}&dataHoraFim=${datafinal}`
      );

      return dadosmap.data.data;
    });

    const dados = await Promise.all(testemap)
      .then(async (response) => {
        const agrupardados = await response.reduce((acc, item) => {
          return acc.concat(
            Array.from(item).filter(
              (filtrar) =>
                (filtrar.unidade === "Itambé R. de Janeiro" ||
                  filtrar.unidade === "Itambé R. de Janeiro" ||
                  filtrar.unidade === "CD Pavuna") &&
                (filtrar.viagemId === parseInt(nf) ||
                  parseInt(filtrar.notaFiscal) === parseInt(nf) ||
                  filtrar.identificador === nf ||
                  filtrar.placa === nf)
            )
          );
        }, []);
        return agrupardados;
      })
      .catch((erro) => {
        return { erro: erro };
      });

    if (dados.length > 0) {
      return dados;
    } else {
      return "não localizado";
    }

    return dados;
  },
  buscainfonf: async (viagem, nf) => {
    const dadosmap = await Axios.get(
      `/api/viagem-faturada/${viagem}/obter-notas-fiscais-por-viagem`
    )
      .then(async (response) => {
        if (nf) {
          const filtrado = await response.data.data.filter(
            (filtrar) => filtrar.notaFiscal === nf
          );
          return filtrado;
        } else {
          return response.data.data;
        }
      })
      .catch((erro) => {
        return { erro: erro };
      });

    return dadosmap;
  },

  buscarItensDaNota: async (viagem, arrayFiltro) => {
    const dadosmap = await Axios.get(
      `/api/viagem-faturada/${viagem}/anomalias-registradas`
    )
      .then(async (response) => {
        const filtrado = await response.data.data.filter(
          (filtrar) => arrayFiltro.includes(filtrar.numeroNotaFiscal)
          //return arrayPrincipal.filter(objeto => arrayFiltro.includes(objeto[chave]));
        );

        // Agrupar os arrays em um único array com base em uma condição
        const resultado = filtrado.reduce((acumulador, arrayAtual) => {
          // Condição para filtrar os objetos do array atual
          const objetosFiltrados = arrayAtual.itens.filter(
            (objeto) => objeto.motivo !== null
          );
          // Adicionar os objetos filtrados ao acumulador
          return acumulador.concat(objetosFiltrados);
        }, []);

        const novoArray = filtrado
          .map(({ numeroNotaFiscal, tipoRetorno, itens }) =>
            itens.map((iten) => {
              if (iten.motivo !== null) {
                return {
                  nota_fiscal: numeroNotaFiscal,
                  motivo: tipoRetorno,
                  produto: parseInt(iten.codigo),
                  quantidade: iten.quantidadeDevolvida,
                };
              }
            })
          )
          .flat();

        return novoArray;

        //return filtrado[0].itens;
      })
      .catch((erro) => {
        return { erro: "não localizado" };
      });
    return dadosmap;
  },
};

module.exports = Ravex;
