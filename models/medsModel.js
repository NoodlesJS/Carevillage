const mongoose = require('mongoose');

const medSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cv_users'
    },
    medicine: {
        type: String
    },
    amount: {
        type: String
    },
    prescriber: {
        type: String
    },
    pharmacy: {
        type: String
    },
    start: {
        type: String
    }
});

medSchema.methods.serialize = function() {
    return {
        medicine: this.medicine,
        amount: this.amount,
        prescriber: this.prescriber,
        pharmacy: this.pharmacy,
        start: this.start
    };
};

module.exports = mongoose.model('meds', medSchema);