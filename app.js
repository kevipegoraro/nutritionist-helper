const STORAGE_KEY = 'leticiaNutriV1Data';
const fieldIds = ['paciente','consulta','nascimento','idade','sexo','peso','altura','objetivo','atividade','deficit','gorduraManual','intolerancias','alergias','preferencias','naoGosta','fome','evacuacao','alcool','sono','sabado','domingo','medicamentos','suplementos','recordatorio','infoGerais','orientacoes'];

function byId(id) { return document.getElementById(id); }
function readStoredData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (_) { return {}; } }
function writeStoredData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function saveVisibleFields() {
  const data = readStoredData();
  fieldIds.forEach(function(id) {
    const field = byId(id);
    if (field && !field.readOnly) data[id] = field.value;
  });
  writeStoredData(data);
}

function loadVisibleFields() {
  const data = readStoredData();
  fieldIds.forEach(function(id) {
    const field = byId(id);
    if (!field || field.readOnly) return;
    if (Object.prototype.hasOwnProperty.call(data, id)) field.value = data[id];
  });
  const consulta = byId('consulta');
  if (consulta && !consulta.value) consulta.valueAsDate = new Date();
  const deficit = byId('deficit');
  if (deficit && deficit.value === '') deficit.value = '0';
}

function getValue(id) {
  const field = byId(id);
  if (field) return field.value;
  return readStoredData()[id] || '';
}
function setText(id, value) { const out = byId(id); if (out) out.textContent = value; }
function setValue(id, value) { const out = byId(id); if (out) out.value = value; }
function toNum(value) { const n = parseFloat(String(value || '').replace(',', '.')); return Number.isFinite(n) ? n : null; }

function calcIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const hoje = new Date();
  const nasc = new Date(dataNascimento + 'T00:00:00');
  if (Number.isNaN(nasc.getTime())) return null;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 0 ? idade : null;
}
function classificarIMC(imc) {
  if (imc == null) return 'Aguardando dados';
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Eutrofia';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade grau I';
  if (imc < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}
function calcGordura(imc, idade, sexo) {
  if (imc == null || idade == null || !sexo) return null;
  const sexoNum = sexo === 'M' ? 1 : 0;
  const bf = (1.20 * imc) + (0.23 * idade) - (10.8 * sexoNum) - 5.4;
  return Math.max(2, Math.min(65, bf));
}
function calcTMB(peso, alturaCm, idade, sexo) {
  if (peso == null || alturaCm == null || idade == null || !sexo) return null;
  return sexo === 'F' ? (10 * peso) + (6.25 * alturaCm) - (5 * idade) - 161 : (10 * peso) + (6.25 * alturaCm) - (5 * idade) + 5;
}
function format(value, suffix) { return value == null ? '--' : value.toFixed(1).replace('.', ',') + (suffix || ''); }

function atualizar() {
  const idadeAuto = calcIdade(getValue('nascimento'));
  const idadeField = byId('idade');
  if (idadeAuto !== null && idadeField) {
    idadeField.value = idadeAuto;
    const data = readStoredData();
    data.idade = String(idadeAuto);
    writeStoredData(data);
  }
  const idade = toNum(getValue('idade'));
  const peso = toNum(getValue('peso'));
  const alturaCm = toNum(getValue('altura'));
  const alturaM = alturaCm ? alturaCm / 100 : null;
  const sexo = getValue('sexo');
  const fa = toNum(getValue('atividade')) || 1.2;
  const deficit = toNum(getValue('deficit')) || 0;
  const gorduraManual = toNum(getValue('gorduraManual'));

  const imc = peso && alturaM ? peso / (alturaM * alturaM) : null;
  const gordura = gorduraManual != null ? gorduraManual : calcGordura(imc, idade, sexo);
  const mmc = (peso != null && gordura != null) ? peso * (1 - gordura / 100) : null;
  const tmb = calcTMB(peso, alturaCm, idade, sexo);
  const get = tmb != null ? tmb * fa : null;
  const ncd = get != null ? get + deficit : null;

  setText('topPatient', (getValue('paciente') || '').trim() || 'Kevi Pegoraro');
  setText('imcVal', format(imc));
  setText('imcClass', classificarIMC(imc));
  setText('gorduraVal', format(gordura, '%'));
  setText('mmcVal', format(mmc, ' kg'));
  setText('tmbVal', format(tmb, ' kcal'));
  setText('getVal', format(get, ' kcal'));
  setText('ncdVal', format(ncd, ' kcal'));

  setValue('tmbPeso', peso != null ? String(peso).replace('.', ',') + ' kg' : '');
  setValue('tmbAltura', alturaCm != null ? String(alturaCm).replace('.', ',') + ' cm' : '');
  setValue('tmbIdade', idade != null ? String(idade) : '');
  setValue('tmbSexo', sexo === 'F' ? 'Mulher' : sexo === 'M' ? 'Homem' : '');
}

function limparFormulario() {
  document.querySelectorAll('input, textarea').forEach(function(field) { if (!field.readOnly) field.value = ''; });
  document.querySelectorAll('select').forEach(function(select) { select.selectedIndex = 0; });
  localStorage.removeItem(STORAGE_KEY);
  const consulta = byId('consulta');
  if (consulta) consulta.valueAsDate = new Date();
  const deficit = byId('deficit');
  if (deficit) deficit.value = '0';
  saveVisibleFields();
  atualizar();
}

function resumoTexto() {
  const sexoTexto = getValue('sexo') === 'F' ? 'Mulher' : getValue('sexo') === 'M' ? 'Homem' : '';
  const rows = [
    ['Patient', getValue('paciente')], ['Consultation date', getValue('consulta')], ['Date of birth', getValue('nascimento')],
    ['Age', getValue('idade')], ['Sex', sexoTexto], ['Weight', getValue('peso')], ['Height', getValue('altura')], ['Goal', getValue('objetivo')],
    ['Intolerances', getValue('intolerancias')], ['Allergies', getValue('alergias')], ['Preferences', getValue('preferencias')], ['Foods disliked', getValue('naoGosta')],
    ['Strongest hunger', getValue('fome')], ['Bowel movements', getValue('evacuacao')], ['Alcohol', getValue('alcool')], ['Sleep', getValue('sono')], ['Saturday habits', getValue('sabado')],
    ['Sunday habits', getValue('domingo')], ['Medications', getValue('medicamentos')], ['Supplements', getValue('suplementos')], ['Food recall', getValue('recordatorio')],
    ['General information', getValue('infoGerais')], ['Guidance', getValue('orientacoes')], ['BMI', byId('imcVal')?.textContent || '--'], ['BMI classification', byId('imcClass')?.textContent || '--'],
    ['Body fat %', byId('gorduraVal')?.textContent || '--'], ['LBM', byId('mmcVal')?.textContent || '--'], ['BMR', byId('tmbVal')?.textContent || '--'], ['TDEE', byId('getVal')?.textContent || '--'], ['DCN / TEV', byId('ncdVal')?.textContent || '--']
  ];
  return 'Anamnese Clínica - Nutritionist App\n' + '='.repeat(38) + '\n\n' + rows.map(function(row) { return row[0] + ': ' + (row[1] || '-'); }).join('\n');
}
function downloadTxt() {
  saveVisibleFields();
  atualizar();
  const blob = new Blob([resumoTexto()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const nome = (getValue('paciente') || 'paciente').trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'paciente';
  a.href = url;
  a.download = 'anamnese-' + nome + '.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
window.limparFormulario = limparFormulario;
window.downloadTxt = downloadTxt;

loadVisibleFields();
document.querySelectorAll('input, select, textarea').forEach(function(field) {
  field.addEventListener('input', function() { saveVisibleFields(); atualizar(); });
  field.addEventListener('change', function() { saveVisibleFields(); atualizar(); });
});
const menuToggle = byId('menuToggle');
const drawer = byId('drawer');
if (menuToggle && drawer) menuToggle.addEventListener('click', function() { drawer.classList.toggle('open'); });
saveVisibleFields();
atualizar();
