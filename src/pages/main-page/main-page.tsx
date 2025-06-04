import React, { JSX } from 'react';

const tasks: string[] = ['Тестовое задание', 'Прекрасный код', 'Покрытие тестами'];

enum Buttons {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
  Clear = 'Clear completed',
}

function MainPage(): JSX.Element {

  const inputTaskRef = React.useRef<HTMLInputElement>(null);

  const [todoTasks, setTodoTasks] = React.useState<string[]>(tasks)
  const [inputTaskValue, setInputTaskValue] = React.useState<string>('');

  const [checkedTasksValue, setcheckedTasksValue] = React.useState<string[]>([]);

  const [activeTasks, setActiveTasks] = React.useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);

  const [renderedTasks, setRenderedTasks] = React.useState<string[]>([]);

  const [activeSortFilter, setActiveSortFilter] = React.useState<string>(Buttons.All);

  const isChecked = (task: string): boolean => checkedTasksValue.includes(task);

  const handlePressEnter = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
    if (evt.key === 'Enter' && inputTaskRef.current && inputTaskRef.current?.value.length !== 0) {
      const task = inputTaskRef.current?.value;
      setTodoTasks(todoTasks => [...todoTasks, task]);
      setInputTaskValue('')
    }
  }

  const handleTaskChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = evt.target.checked;
    const currentValue = evt.target.value;

    if (isChecked) {
      setCompletedTasks([...completedTasks, currentValue]);
      setcheckedTasksValue([...checkedTasksValue, currentValue]);
    } else {
      setCompletedTasks(completedTasks.filter(task => task !== currentValue));
      setcheckedTasksValue(checkedTasksValue.filter(task => task !== currentValue));
    }
  }

  const handleSortButtonClick = (evt: React.MouseEvent<HTMLButtonElement>): void => {
    const target = evt.target as HTMLElement;
    setActiveSortFilter(target.innerHTML);
  }

  React.useEffect(() => {
    if (completedTasks.length !== 0) {
      setActiveTasks(todoTasks.filter(task => !completedTasks.includes(task)));
    } else {
      setActiveTasks(todoTasks);
    }
  }, [completedTasks, todoTasks])

  React.useEffect(() => {
    switch (activeSortFilter) {
      case Buttons.All:
        setRenderedTasks(todoTasks);
        break;
      case Buttons.Active:
        setRenderedTasks(activeTasks);
        break;
      case Buttons.Completed:
        setRenderedTasks(completedTasks);
        break;
      case Buttons.Clear:
        setTodoTasks(activeTasks);
        setRenderedTasks(todoTasks);
        setCompletedTasks([]);
        setActiveSortFilter(Buttons.All);
        break;
    }
  }, [activeSortFilter, activeTasks, todoTasks])

  return (
    <section className='main'>
      <div className="main-wrapper">
        <div className="inner-wrapper">
          <h1 className="main-title">todos</h1>
          <div className="todo-list-wrapper">
            <ul className="todo-list">
              <div className="input-tasks-wrapper">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  onKeyUp={handlePressEnter}
                  onChange={(evt) => setInputTaskValue(evt.target.value)}
                  ref={inputTaskRef}
                  value={inputTaskValue}
                />
              </div>
              {
                renderedTasks && renderedTasks.map((task, index) => (
                  <li className="todo-item" key={index}>
                    <label className='todo-item__label' htmlFor={`task-${index}`}>
                      <input
                        className="todo-checkbox visually-hidden"
                        type="checkbox"
                        id={`task-${index}`}
                        name="todo-checkbox"
                        value={task}
                        checked={isChecked(task)}
                        onChange={handleTaskChange}
                      />
                      <span className="todo-checkbox__custom"></span>
                      {task}
                    </label>
                  </li>
                ))
              }

              <div className="todo-nav">
                <p className="todo-items-count">{activeTasks.length} items left</p>
                <div className="button-controls-wrapper">
                  <button className='button-control' type="button" onClick={handleSortButtonClick}>{Buttons.All}</button>
                  <button className='button-control' type="button" onClick={handleSortButtonClick}>{Buttons.Active}</button>
                  <button className='button-control' type="button" onClick={handleSortButtonClick}>{Buttons.Completed}</button>
                </div>
                <button className='button-control' type="button" onClick={handleSortButtonClick}>{Buttons.Clear}</button>
              </div>

            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainPage;