// to have less writing in App
function Nav({page, navigator}){

    // make the button of the current page bold and underline
    function getButtonStyle(buttonPage) {
        return {
            fontWeight: page === buttonPage ? 'bold' : 'normal',
            textDecoration: page === buttonPage ? 'underline' : 'none'
        }
    }

    return (
        <nav style={{ display: 'flex', gap: '12px' }}> {/* can navigate here - change pages,
        if we are on some page, we can't press it again */}
            <button
                style={getButtonStyle('home')}
                onClick={() => navigator('home')}
                >בית
                </button>
            <button
                style={getButtonStyle('clinic')}
                onClick={() => navigator('clinic')}
                >על הקליניקה
                </button>
            <button
                style={getButtonStyle('roni')}
                onClick={() => navigator('roni')}
                >על רוני
                </button>
        </nav>
    )
}

export default Nav