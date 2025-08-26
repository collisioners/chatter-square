const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const chatInput = document.getElementById('chat');

const id = Date.now().toString();
const playerRef = db.ref('players/' + id);
const chatRef = db.ref('chat');

let players = {};

playerRef.set({ x: 100, y: 100, name: 'Player' + id.slice(-4) });
playerRef.onDisconnect().remove();

db.ref('players').on('value', snapshot => {
  players = snapshot.val() || {};
});

chatRef.on('child_added', snapshot => {
  const msg = snapshot.val();
  const div = document.createElement('div');
  div.textContent = `${msg.name}: ${msg.text}`;
  document.body.appendChild(div);
});

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    chatRef.push({ name: players[id].name, text: chatInput.value });
    chatInput.value = '';
  }
});

document.addEventListener('keydown', e => {
  const me = players[id];
  if (!me) return;
  if (e.key === 'ArrowUp') me.y -= 5;
  if (e.key === 'ArrowDown') me.y += 5;
  if (e.key === 'ArrowLeft') me.x -= 5;
  if (e.key === 'ArrowRight') me.x += 5;
  playerRef.set(me);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let pid in players) {
    const p = players[pid];
    ctx.fillStyle = pid === id ? 'blue' : 'gray';
    ctx.fillRect(p.x, p.y, 20, 20);
    ctx.fillStyle = 'black';
    ctx.fillText(p.name, p.x, p.y - 5);
  }
  requestAnimationFrame(draw);
}
draw();
