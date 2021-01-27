

class Message {
    constructor(id, user, titre, contenu, messageDate, messageParent) {
        this.id = id;
        this.user = user;
        this.titre = titre;
        this.contenu = contenu;
        this.messageDate = messageDate;
        this.messageParent = messageParent
    }
    saveMessage() {
        return "INSERT INTO messages (titre, contenu,idUtilisateur) VALUES (?,?,?)"
    }

    getAll() {
        return " select *, messages.id as messageId, utilisateur.id as utilisateurId from messages inner join utilisateur where messages.idUtilisateur = utilisateur.id;" // ajout d'alias pour récupérer les différnets ID
    }

    getOneMessageById() {
        return " select *, messages.id as messageId, utilisateur.id as utilisateurId from messages inner join utilisateur where messages.id = ? " // ajout d'alias pour récupérer le message par son ID
    }
deleteMessage(){
    return "delete from messages where id = ?"
}
}
module.exports = Message