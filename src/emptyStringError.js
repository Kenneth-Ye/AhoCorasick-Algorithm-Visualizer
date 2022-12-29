const EmptyString = (props) => {
    const {showError} = props;
    if (showError) {
        return (
            <div>
                No Empty Strings!
            </div>
        )
    }
    return null;
}
export default EmptyString;