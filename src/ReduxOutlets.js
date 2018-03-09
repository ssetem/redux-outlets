export const connectOutletToStore = (outlet, store, options = { ownProps: {} }) => {
    const [mapStateToProps, mapDispatchToProps = {}] = outlet
    let previousProps = {}
    let statefulOutlet = {
        ownProps: options.ownProps,
        props: {},
        actions: {},
        propsChanged: false
    }
    const loadState = () => {
        let props = mapStateToProps(store.getState(), statefulOutlet.ownProps)
        previousProps = statefulOutlet.props
        statefulOutlet.props = props
        statefulOutlet.propsChanged = !shallowequal(previousProps, statefulOutlet.props)
        statefulOutlet.actions = bindActionCreators(mapDispatchToProps, store.dispatch)
    }

    statefulOutlet.setOwnProps = (ownProps) => {
        statefulOutlet.ownProps = {
            ...statefulOutlet.ownProps,
            ...ownProps
        }
        loadState()
    }

    statefulOutlet.getPreviousProps = () => {
        return previousProps
    }

    store.subscribe(loadState)
    loadState()
    return statefulOutlet
}

export const logOutletChanges = (outlet) => {
    if (outlet.propsChanged) {
        console.log(difflet({ indent: 2, comment: true }).compare(
            outlet.getPreviousProps(), outlet.props
        ))
    } else {
        console.log("No changes detected")
    }

}