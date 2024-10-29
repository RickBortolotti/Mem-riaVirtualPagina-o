// Adiciona um evento de clique ao botão "Simular"
document.getElementById('simulateButton').addEventListener('click', function() {
    // Captura o número de frames e a sequência de páginas do input
    var numFrames = parseInt(document.getElementById('numFrames').value);
    var pageSequence = document.getElementById('pageSequence').value.split(',').map(Number);

    // Executa as simulações para os dois algoritmos
    var secondChanceOutput = simulateSecondChance(numFrames, pageSequence);
    var fifoOutput = simulateFIFO(numFrames, pageSequence);

    // Exibe os resultados na área de saída
    document.getElementById('output').innerText = secondChanceOutput + '\n\n' + fifoOutput;
});

// Função que simula o algoritmo de Segunda Chance
function simulateSecondChance(numFrames, pageSequence) {
    // Inicializa os frames e os bits de referência
    var frames = Array(numFrames).fill(0);
    var referenceBits = Array(numFrames).fill(0);
    var pageFaults = 0; // Contador de falhas de página
    var output = 'Resultado com o algoritmo de Segunda Chance:\n\n';

    // Itera sobre cada página na sequência
    for (var page of pageSequence) {
        var found = false; // Indica se a página foi encontrada
        var emptyFrame = -1; // Armazena a posição de um frame vazio

        // Verifica se a página já está nos frames
        for (var i = 0; i < numFrames; i++) {
            if (frames[i] === page) {
                found = true; // Página encontrada
                referenceBits[i] = 1; // Marca como referenciada
                break; // Sai do loop
            }
            // Se um frame vazio for encontrado
            if (frames[i] === 0 && emptyFrame === -1) {
                emptyFrame = i; // Armazena a posição do frame vazio
            }
        }

        // Se a página foi encontrada, exibe resultado e continua
        if (found) {
            output += page + ' false [' + frames.join(',') + ']\n';
            continue; // Continua para a próxima página
        }

        // Se a página não foi encontrada, precisa ser substituída
        var index = emptyFrame !== -1 ? emptyFrame : 0; // Usa frame vazio ou o primeiro
        var replaced = false; // Indica se uma página foi substituída

        // Enquanto não substituir
        while (!replaced) {
            // Se o bit de referência for 0, substitui
            if (referenceBits[index] === 0) {
                output += page + ' true [' + frames.join(',') + ']\n'; // Registra a troca
                frames[index] = page; // Substitui a página
                referenceBits[index] = 0; // Reseta o bit de referência
                pageFaults++; // Incrementa falha de página
                replaced = true; // Página foi substituída
            } else {
                // Reseta o bit de referência e avança para o próximo
                referenceBits[index] = 0; 
                index = (index + 1) % numFrames; // Cicla através dos frames
            }
        }

        // Exibe o resultado após a troca
        output += page + ' true [' + frames.join(',') + ']\n';
    }

    // Adiciona o total de trocas ao resultado final
    output += '\nTotal de trocas: ' + pageFaults;
    return output; // Retorna o resultado
}

// Função que simula o algoritmo FIFO
function simulateFIFO(numFrames, pageSequence) {
    // Inicializa os frames
    var frames = Array(numFrames).fill(0);
    var pageFaults = 0; // Contador de falhas de página
    var nextFrame = 0; // Índice do próximo frame a ser substituído
    var output = 'Resultado com o algoritmo FIFO:\n\n';

    // Itera sobre cada página na sequência
    for (var page of pageSequence) {
        // Verifica se a página já está nos frames
        var found = frames.includes(page);

        // Se a página foi encontrada, exibe resultado e continua
        if (found) {
            output += page + ' false [' + frames.join(',') + ']\n';
            continue; // Continua para a próxima página
        }

        // Se a página não foi encontrada, precisa ser substituída
        output += page + ' true [' + frames.join(',') + ']\n'; // Registra a troca
        frames[nextFrame] = page; // Substitui a página
        nextFrame = (nextFrame + 1) % numFrames; // Cicla para o próximo frame
        pageFaults++; // Incrementa falha de página
    }

    // Adiciona o total de trocas ao resultado final
    output += '\nTotal de trocas: ' + pageFaults;
    return output; // Retorna o resultado
}
