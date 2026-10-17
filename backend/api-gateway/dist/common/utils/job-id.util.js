"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJobId = generateJobId;
const crypto = require("crypto");
function generateJobId() {
    const hex = crypto.randomBytes(3).toString('hex');
    return `#job-${hex}`;
}
//# sourceMappingURL=job-id.util.js.map