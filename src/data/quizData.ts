/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion, QuizResultProfile, UserAnswers } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Incômodo Abdominal',
    title: 'QUAL É O SEU MAIOR INCÔMODO COM A SUA REGIÃO ABDOMINAL HOJE?',
    highlightWord: 'INCÔMODO',
    whyWeAsk: 'Compreender a sua queixa inicial nos ajuda a diferenciar a retenção temporária de líquidos da simples sensação de peso ou digestão lenta.',
    options: [
      { id: 'q1_acordo_bem_estufa', label: 'Acordo bem, mas a barriga vai estufando ao longo do dia', profileTag: 'digestao_lenta', weight: 15 },
      { id: 'q1_peso_constante', label: 'Sensação frequente de estufamento e peso depois de comer', profileTag: 'digestao_lenta', weight: 18 },
      { id: 'q1_roupas_apertadas', label: 'Cintura e roupas apertadas, principalmente no final da tarde', profileTag: 'retencao', weight: 14 },
      { id: 'q1_retencao_geral', label: 'Inchaço evidente no corpo todo e sensação de cansaço', profileTag: 'retencao', weight: 12 },
    ],
    microProof: {
      avatarText: 'JM',
      quote: 'Eu terminava o dia com a calça apertada e achava que era só gordura. Quando descobri o que estava fermentando e ajustei os hábitos nos primeiros 7 dias, minha barriga desinchou e a leveza voltou sem dieta maluca.',
      author: 'Juliana M., 38 anos'
    }
  },
  {
    id: 2,
    category: 'Padrão Diário',
    title: 'EM QUAL MOMENTO DO DIA VOCÊ SENTE SUA BARRIGA MAIS PESADA OU ESTUFADA?',
    highlightWord: 'MOMENTO',
    whyWeAsk: 'O horário de pico do inchaço é um forte indicador de como o seu organismo está processando os alimentos e lidando com o acúmulo de gases.',
    options: [
      { id: 'q2_pos_almoco', label: 'Logo após o almoço, parece que a digestão demora horas', profileTag: 'digestao_lenta', weight: 14 },
      { id: 'q2_final_tarde', label: 'No final da tarde ou começo da noite, quando o cansaço bate', profileTag: 'estresse_rotina', weight: 16 },
      { id: 'q2_o_dia_todo', label: 'Quase o dia todo, raramente sinto meu abdômen leve', profileTag: 'retencao', weight: 18 },
      { id: 'q2_varia_comida', label: 'Oscila bastante de acordo com o que escolho comer', profileTag: 'digestao_lenta', weight: 12 },
    ]
  },
  {
    id: 3,
    category: 'Ritmo Intestinal',
    title: 'COMO VOCÊ DESCREVERIA O FUNCIONAMENTO DO SEU INTESTINO?',
    highlightWord: 'INTESTINO',
    whyWeAsk: 'A regularidade intestinal é a base para diminuir a distensão abdominal. Um ritmo travado retém toxinas e fermenta os alimentos além da conta.',
    options: [
      { id: 'q3_reloginho', label: 'Funciona todos os dias sem grande dificuldade', profileTag: 'habitos_gerais', weight: 6 },
      { id: 'q3_preguicoso', label: 'Costuma ser preguiçoso: fico 2 ou mais dias sem ir ao banheiro', profileTag: 'digestao_lenta', weight: 16 },
      { id: 'q3_irregular', label: 'Muito irregular: dias preso, dias solto, sempre imprevisível', profileTag: 'digestao_lenta', weight: 14 },
      { id: 'q3_gases_fermentacao', label: 'Tenho bastante gases, fermentação e cólicas de desconforto', profileTag: 'retencao', weight: 17 },
    ]
  },
  {
    id: 4,
    category: 'Hidratação Diária',
    title: 'COMO É O SEU CONSUMO REAL DE ÁGUA AO LONGO DO DIA?',
    highlightWord: 'ÁGUA',
    whyWeAsk: 'Quando você bebe pouca água, seu corpo entra em modo de defesa e retém cada gota de líquido, deixando a barriga e pernas mais inchadas.',
    options: [
      { id: 'q4_boa', label: 'Bebo com facilidade cerca de 2 litros ou mais por dia', profileTag: 'habitos_gerais', weight: 5 },
      { id: 'q4_esqueco', label: 'Tento beber, mas com a correria do dia eu vivo esquecendo', profileTag: 'retencao', weight: 14 },
      { id: 'q4_pouca', label: 'Bebo pouca água pura (menos de 1 litro ao dia)', profileTag: 'retencao', weight: 18 },
      { id: 'q4_substituo', label: 'Acabo substituindo água por muito café, chás adoçados ou sucos', profileTag: 'retencao', weight: 16 },
    ],
    microProof: {
      avatarText: 'CS',
      quote: 'Eu vivia tentando chás aleatórios e quase não bebia água do jeito certo. Seguindo o passo a passo de hidratação e combinações digestivas do plano de 7 dias, minhas roupas voltaram a fechar com conforto.',
      author: 'Carla S., 42 anos'
    }
  },
  {
    id: 5,
    category: 'Alimentação e Rotina',
    title: 'QUAIS DESTES HÁBITOS MAIS FAZEM PARTE DA SUA ROTINA ALIMENTAR?',
    highlightWord: 'ROTINA',
    whyWeAsk: 'Pequenos padrões diários, como comer rápido ou exagerar em farinhas brancas, multiplicam a fermentação no trato digestivo.',
    options: [
      { id: 'q5_comer_rapido', label: 'Como correndo e às vezes na frente do celular ou computador', profileTag: 'digestao_lenta', weight: 15 },
      { id: 'q5_farinhas_massas', label: 'Consumo pães, massas e farinhas refinadas na maioria dos dias', profileTag: 'retencao', weight: 14 },
      { id: 'q5_doces_ansiedade', label: 'Bate uma vontade incontrolável de doces, principalmente à tarde', profileTag: 'estresse_rotina', weight: 16 },
      { id: 'q5_tento_saudavel', label: 'Tento comer de forma saudável, mas ainda assim continuo estufada', profileTag: 'digestao_lenta', weight: 13 },
    ]
  },
  {
    id: 6,
    category: 'Sono e Estresse',
    title: 'COMO ESTÃO OS SEUS NÍVEIS DE ESTRESSE E A QUALIDADE DO SEU SONO?',
    highlightWord: 'ESTRESSE',
    whyWeAsk: 'Noites mal dormidas e estresse contínuo elevam hormônios que favorecem a retenção de líquidos e lentificam os processos digestivos.',
    options: [
      { id: 'q6_tranquila', label: 'Durmo bem e lido com tranquilidade com as tarefas do dia', profileTag: 'habitos_gerais', weight: 6 },
      { id: 'q6_acordo_cansada', label: 'Durmo, mas parece que acordo sem energia renovada', profileTag: 'estresse_rotina', weight: 14 },
      { id: 'q6_muito_estresse', label: 'Rotina bastante acelerada e sinto tensão acumulada no corpo', profileTag: 'estresse_rotina', weight: 16 },
      { id: 'q6_insonia', label: 'Dificuldade frequente para pegar no sono ou sono picado', profileTag: 'estresse_rotina', weight: 18 },
    ]
  },
  {
    id: 7,
    category: 'Experiências Anteriores',
    title: 'O QUE VOCÊ JÁ TENTOU PARA DIMINUIR A BARRIGA E DESINCHAR?',
    highlightWord: 'TENTOU',
    whyWeAsk: 'Muitas tentativas frustradas acontecem porque dietas restritivas e chás aleatórios tratam o sintoma e esquecem o ritmo do organismo.',
    options: [
      { id: 'q7_chas_aleatorios', label: 'Chás diuréticos que deram alívio temporário, mas o inchaço voltou', profileTag: 'retencao', weight: 13 },
      { id: 'q7_dietas_restritivas', label: 'Cortes radicais de comida que foram difíceis de sustentar', profileTag: 'digestao_lenta', weight: 15 },
      { id: 'q7_remedios', label: 'Shakes ou soluções milagrosas que custaram caro e não funcionaram', profileTag: 'habitos_gerais', weight: 14 },
      { id: 'q7_primeira_vez', label: 'Estou buscando agora um passo a passo simples e com bom senso', profileTag: 'habitos_gerais', weight: 10 },
    ]
  },
  {
    id: 8,
    category: 'Faixa Etária',
    title: 'QUAL É A SUA FAIXA ETÁRIA ATUAL?',
    highlightWord: 'IDADE',
    whyWeAsk: 'Após os 28 anos, mudanças fisiológicas naturais tornam a retenção hídrica mais comum, exigindo combinações alimentares mais inteligentes.',
    options: [
      { id: 'q8_28_34', label: '28 a 34 anos', profileTag: 'habitos_gerais', weight: 10 },
      { id: 'q8_35_44', label: '35 a 44 anos', profileTag: 'habitos_gerais', weight: 12 },
      { id: 'q8_45_54', label: '45 a 54 anos', profileTag: 'habitos_gerais', weight: 14 },
      { id: 'q8_55_mais', label: '55 anos ou mais', profileTag: 'habitos_gerais', weight: 15 },
    ]
  }
];

export function calculateQuizProfile(answers: UserAnswers): QuizResultProfile {
  let totalScore = 40; // baseline
  let retencaoCount = 0;
  let digestaoCount = 0;
  let estresseCount = 0;

  QUIZ_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id];
    const option = q.options.find((opt) => opt.id === selectedOptionId);
    if (option) {
      totalScore += (option.weight || 10) * 0.45;
      if (option.profileTag === 'retencao') retencaoCount++;
      if (option.profileTag === 'digestao_lenta') digestaoCount++;
      if (option.profileTag === 'estresse_rotina') estresseCount++;
    }
  });

  // Clamp score between 64 and 86 to give a realistic, grounded index
  const normalizedScore = Math.min(88, Math.max(62, Math.round(totalScore)));

  // Determine dominant profile
  if (retencaoCount >= digestaoCount && retencaoCount >= estresseCount) {
    return {
      score: normalizedScore,
      badge: 'Retenção Hídrica & Estufamento',
      title: 'Acúmulo de Líquidos e Barriga Estufada ao Longo do Dia',
      summary: 'Suas respostas mostram um padrão clássico de retenção hídrica: você até acorda mais leve, mas a combinação de hidratação desregulada, sódio oculto e carboidratos refinados faz o corpo segurar líquidos e pressionar a cintura conforme as horas passam.',
      recommendationFocus: 'Ajuste estratégico de água, chás digestivos naturais e trocas inteligentes de 7 dias para ajudar o corpo a liberar o líquido retido sem passar fome.',
      pillars: [
        {
          title: 'Hidratação Inteligente',
          description: 'Ajustar os horários e a quantidade certa de água para tirar o organismo do modo de retenção e aliviar o inchaço.',
          icon: 'droplets'
        },
        {
          title: 'Combinações Desinchantes',
          description: 'Trocas simples com alimentos comuns de supermercado que reduzem o estufamento pós-refeição no fim da tarde.',
          icon: 'utensils'
        },
        {
          title: 'Ritmo Intestinal Ativo',
          description: 'Fibras solúveis e hábitos leves de 7 dias que destravam o intestino com regularidade e conforto abdominal.',
          icon: 'check-circle'
        }
      ]
    };
  } else if (digestaoCount >= retencaoCount && digestaoCount >= estresseCount) {
    return {
      score: normalizedScore,
      badge: 'Digestão Lenta & Fermentação',
      title: 'Estufamento Pós-Refeição e Trânsito Digestivo Lento',
      summary: 'Suas respostas revelam que o volume abdominal não vem apenas de peso acumulado — grande parte do desconforto nasce da fermentação de refeições mal combinadas, fazendo a barriga dilatar poucas horas depois de comer.',
      recommendationFocus: 'Ordem certa dos alimentos, mastigação estratégica e cardápio leve de 7 dias para reduzir gases e fermentação após as refeições.',
      pillars: [
        {
          title: 'Faxina Digestiva Leve',
          description: 'Combinações simples que diminuem a fermentação gástrica e evitam a sensação de barriga pesada após o almoço.',
          icon: 'sparkles'
        },
        {
          title: 'Horários e Ritmo das Refeições',
          description: 'Pequenos ajustes práticos que facilitam a digestão natural mesmo nos dias mais corridos da semana.',
          icon: 'clock'
        },
        {
          title: 'Cardápio Fácil de 7 Dias',
          description: 'Refeições saborosas com ingredientes econômicos do dia a dia, pensadas para devolver leveza sem passar fome.',
          icon: 'book-open'
        }
      ]
    };
  } else {
    return {
      score: normalizedScore,
      badge: 'Inchaço por Tensão & Rotina',
      title: 'Rotina Acelerada, Cortisol Alto e Estufamento Abdominal',
      summary: 'Seu padrão de respostas reflete noites pouco restauradoras e tensão acumulada, o que desacelera a digestão, aumenta a retenção de líquidos e dispara a vontade de doces ou beliscos no final da tarde.',
      recommendationFocus: 'Rotina alimentar calmante e cardápio reconfortante de 7 dias para controlar a compulsão vespertina e desinchar com equilíbrio.',
      pillars: [
        {
          title: 'Cardápio Anti-Ansiedade',
          description: 'Combinações ricas em saciedade que estabilizam a energia e reduzem os picos de vontade por doces à tarde.',
          icon: 'heart'
        },
        {
          title: 'Alívio da Tensão Abdominal',
          description: 'Chás suaves e rituais noturnos fáceis de aplicar para melhorar a digestão e o conforto ao dormir.',
          icon: 'moon'
        },
        {
          title: 'Plano Prático Sem Culpa',
          description: 'Um passo a passo realista de 7 dias, sem dietas extremas, para devolver leveza à sua rotina.',
          icon: 'shield-check'
        }
      ]
    };
  }
}
