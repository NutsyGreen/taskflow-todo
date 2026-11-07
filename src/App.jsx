import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCheck, Circle, ListTodo, Plus, Trash2, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'taskflow-tasks-v1';
const initialTasks = [
  { id: 1, title: 'Разобрать входящие сообщения', done: true, createdAt: Date.now() - 3000 },
  { id: 2, title: 'Составить план на неделю', done: false, createdAt: Date.now() - 2000 },
  { id: 3, title: 'Выделить время на обучение', done: false, createdAt: Date.now() - 1000 },
];

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? initialTasks : JSON.parse(saved);
  } catch {
    return initialTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const activeCount = tasks.filter(task => !task.done).length;
  const completedCount = tasks.length - activeCount;
  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  }), [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    setTasks(current => [{ id: crypto.randomUUID(), title, done: false, createdAt: Date.now() }, ...current]);
    setValue('');
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="app-card">
        <header className="topbar">
          <a className="brand" href="#" aria-label="Taskflow — главная">
            <span className="brand-mark"><CheckCheck size={20} strokeWidth={2.5} /></span>
            <span>taskflow</span>
          </a>
          <span className="today-label"><span className="live-dot" /> МОЙ ПЛАН НА СЕГОДНЯ</span>
        </header>

        <section className="intro">
          <div className="eyebrow"><Sparkles size={14} /> МЕНЬШЕ ХАОСА — БОЛЬШЕ ФОКУСА</div>
          <h1>Твои задачи.<br /><span>Твой темп.</span></h1>
          <p>Небольшие шаги каждый день приводят к большим результатам.</p>
        </section>

        <section className="stats" aria-label="Статистика задач">
          <div className="stat-main">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-caption">осталось выполнить</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-label"><span>Прогресс дня</span><strong>{tasks.length ? Math.round(completedCount / tasks.length * 100) : 0}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? completedCount / tasks.length * 100 : 0}%` }} /></div>
            <div className="progress-foot"><span>{completedCount} выполнено</span><span>{tasks.length} всего</span></div>
          </div>
        </section>

        <form className="add-form" onSubmit={addTask}>
          <Plus size={19} className="input-plus" />
          <input
            value={value}
            onChange={event => setValue(event.target.value)}
            placeholder="Какое дело нужно сделать?"
            aria-label="Новая задача"
            maxLength={120}
          />
          <button type="submit" disabled={!value.trim()}><Plus size={17} /> Добавить</button>
        </form>

        <div className="list-heading">
          <div className="list-title"><ListTodo size={19} /><h2>Мои задачи</h2><span className="count-pill">{tasks.length}</span></div>
          <div className="filters" role="tablist" aria-label="Фильтр задач">
            {[
              ['all', 'Все'],
              ['active', 'Активные'],
              ['completed', 'Готово'],
            ].map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={filter === key} className={filter === key ? 'filter active-filter' : 'filter'} onClick={() => setFilter(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map(task => (
            <article className={`task-row ${task.done ? 'task-done' : ''}`} key={task.id}>
              <button className="check-button" type="button" onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Отметить как активную' : 'Отметить выполненной'}>
                {task.done ? <span className="checked-icon"><Check size={15} strokeWidth={3} /></span> : <Circle size={21} strokeWidth={1.7} />}
              </button>
              <span className="task-name">{task.title}</span>
              {task.done && <span className="done-label">ГОТОВО</span>}
              <button className="delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`Удалить задачу: ${task.title}`}><Trash2 size={17} /></button>
            </article>
          )) : (
            <div className="empty-state">
              <span className="empty-icon"><CheckCheck size={24} /></span>
              <strong>{filter === 'completed' ? 'Пока ничего не выполнено' : filter === 'active' ? 'Все задачи выполнены!' : 'Здесь пока пусто'}</strong>
              <span>{filter === 'all' ? 'Добавь первую задачу — и начни двигаться к цели.' : 'Попробуй выбрать другой фильтр или добавь новую задачу.'}</span>
            </div>
          )}
        </div>

        <footer className="footer">
          <span><span className="footer-dot" /> Изменения сохраняются автоматически</span>
          <span>Сделано с фокусом <span className="heart">♥</span></span>
        </footer>
      </section>
      <div className="page-note">ПРОСТРАНСТВО ДЛЯ ВАЖНОГО</div>
    </main>
  );
}
