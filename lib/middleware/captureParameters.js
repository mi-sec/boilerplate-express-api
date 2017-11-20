/** ****************************************************************************************************
 * File: captureParameters.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

function prepareParameters( req, res, next ) {
    process.config.parameterCapture.forEach(
        i => {
            if( req.path.startsWith( i.pre ) ) {
                const p = res.locals;
                let identifier = req.path;
                identifier = identifier.replace( i.pre, '' );
                identifier = identifier.replace( i.post, '' );
                p.params[ i.identifier ] = identifier;

                p.config = process.config.api[ i.path ];
            }
        }
    );

    next();
}

module.exports = () => {
    return prepareParameters;
};