(function(){
  const path = location.pathname.split('/').pop();
  const role = localStorage.getItem('zc_role');

  if (path === 'admin.html'){
    if (role !== 'admin') { alert('Access denied. Redirecting to Home.'); location.href = 'index.html'; }
    window.addEventListener('load', initAdmin);
  }

  if (path === 'user.html'){
    if (role !== 'user') { alert('Access denied. Redirecting to Home.'); location.href = 'index.html'; }
    window.addEventListener('load', initUser);
  }

  window.quickLogin = function(r){
    localStorage.setItem('zc_role', r);
    localStorage.setItem('zc_username', r === 'admin' ? 'Admin Jane' : 'User Alex');
    if (r === 'admin') location.href = 'admin.html'; else location.href = 'user.html';
  }

  window.logout = function(ev){
    if (ev) ev.preventDefault();
    localStorage.removeItem('zc_role');
    localStorage.removeItem('zc_username');
    location.href = 'index.html';
  }

  function initAdmin(){
    document.getElementById('currentRole').textContent = 'Role: Admin';
    const users = [
      {id:1,name:'Alice',role:'user'},
      {id:2,name:'Bob',role:'user'},
      {id:3,name:'Charlie',role:'admin'},
    ];
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeSessions').textContent = Math.floor(Math.random()*10)+1;
    document.getElementById('openTickets').textContent = Math.floor(Math.random()*7);

    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';
    users.forEach(u=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td><button onclick="alert('Pretend editing user ${u.name}')">Edit</button></td>`;
      tbody.appendChild(tr);
    });

    const m = localStorage.getItem('zc_maintenance') === '1';
    const toggle = document.getElementById('maintenanceToggle');
    if (toggle) toggle.checked = m;
    const state = document.getElementById('maintenanceState');
    if (state) state.textContent = m ? 'On' : 'Off';
  }

  window.toggleMaintenance = function(val){
    localStorage.setItem('zc_maintenance', val ? '1' : '0');
    const state = document.getElementById('maintenanceState');
    if (state) state.textContent = val ? 'On' : 'Off';
    alert('Maintenance mode: ' + (val ? 'On' : 'Off'));
  }

  function initUser(){
    const name = localStorage.getItem('zc_username') || 'Guest';
    document.getElementById('userName').textContent = name;
    document.getElementById('profileRole').textContent = 'User';
    document.getElementById('uCurrentRole').textContent = 'Role: User';

    const tasks = JSON.parse(localStorage.getItem('zc_tasks') || '[]');
    renderTasks(tasks);
    window._zcTasks = tasks;
  }

  window.addTask = function(){
    const input = document.getElementById('taskInput');
    const v = input.value && input.value.trim();
    if(!v) return;
    const tasks = JSON.parse(localStorage.getItem('zc_tasks') || '[]');
    tasks.push({id:Date.now(),text:v,done:false});
    localStorage.setItem('zc_tasks', JSON.stringify(tasks));
    input.value = '';
    renderTasks(tasks);
  }

  function renderTasks(tasks){
    const ul = document.getElementById('taskList');
    if(!ul) return;
    ul.innerHTML = '';
    tasks.forEach(t=>{
      const li = document.createElement('li');
      const left = document.createElement('span'); left.textContent = t.text;
      const btns = document.createElement('span');
      btns.innerHTML = `<button onclick="toggleTask(${t.id})">Toggle</button> <button onclick="deleteTask(${t.id})">Delete</button>`;
      li.appendChild(left); li.appendChild(btns);
      ul.appendChild(li);
    });
  }

  window.toggleTask = function(id){
    const tasks = JSON.parse(localStorage.getItem('zc_tasks') || '[]');
    const idx = tasks.findIndex(x=>x.id===id);
    if(idx>=0) tasks[idx].done = !tasks[idx].done;
    localStorage.setItem('zc_tasks', JSON.stringify(tasks));
    renderTasks(tasks);
  }

  window.deleteTask = function(id){
    let tasks = JSON.parse(localStorage.getItem('zc_tasks') || '[]');
    tasks = tasks.filter(x=>x.id!==id);
    localStorage.setItem('zc_tasks', JSON.stringify(tasks));
    renderTasks(tasks);
  }
})();
