# redux-outlets

A Design pattern & test library to move `mapStateToProps` + `mapDispatchToProps` to the data layer and instead export an `outlet` which can be connected to your components.

The beauty in this pattern is `redux-outlets` is not a library and requires no additional src code in your components.

`redux-outlets` only provides Test Utils to help test your `redux-outlets`, `at the data layer.

## Example
From redux documentation

### Before (Vanilla)
```js
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
 
export default VisibleTodoList

```

### After(Using redux-outlets pattern)
```js
//In data layer
export const visibleTodosOutlet = [
    state => ({
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }),
    dispatch => ({
        onTodoClick: id => dispatch(toggleTodo(id))
    })        
]

//In component file
const VisibleTodoList = connect(...visibleTodosOutlet)(TodoList)
 
export default VisibleTodoList
```

### Testing the outlet

```js
import {connectOutletToStore} from "redux-outlets"

it("Test visibleTodoOutlet", function(){
    const store = configureStore({
        todos:[
            {id:1, completed:false, text:"Cook"},
            {id:2, completed:false, text:"Eat"},
        ]
    })
    let todosOutlet = connectOutletToStore(visibleTodosOutlet, store)        
    //shows 2 todos
    expect(todosOutlet.props).toMatchSnapshot()
    todosOutlet.onTodoClick(1)
    //now shows 1 todo
    expect(todosOutlet.props).toMatchSnapshot()
})
       
```