// Dependencies:
import fileStructure from '../file-structure';

export default { handler };

function handler (request, response) {
    let { type } = request.params;

    let structure = fileStructure.getStructure(type);
    response.send(structure);
}
