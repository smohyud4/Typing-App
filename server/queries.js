export function initializeCharQuery() {
    const characters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}_+=-;':,.<>/?" `;
    const values = characters.split("").map(char => {
        if (char === "'") 
            char = "''";
        
        return `($1, '${char}', 0, 0)`;
      });

    return `INSERT INTO character_stats (user_name, character, total_typed, total_correct) VALUES ${values.join(", ")}`;
}

export function updateQueries(characters) {
    const userQuery = 
        `UPDATE users 
         SET 
          total_races = total_races + 1,
          best_wpm = GREATEST(best_wpm, $2), 
          total_wpm = total_wpm + $2, 
          total_accuracy = total_accuracy + $3 
        WHERE 
          username = $1
       `;

    const charQueries = characters.map(([char, data]) => {
        if (char === "'") 
            char = "''";

        return (
           `UPDATE character_stats 
            SET 
              total_typed = total_typed + ${data.total}, 
              total_correct = total_correct + ${data.correct} 
            WHERE 
              user_name = $1 AND character = '${char}'` 
        )
    });

    return [userQuery, charQueries];
}