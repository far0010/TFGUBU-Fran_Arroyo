import oracledb from 'oracledb';

const DB_CONFIG = {
  user: 'TFGUBU',
  password: '1234',
  connectString: '192.168.2.61:1521/FREEPDB1'
};

async function getNominaCount(nif) {
  let connection;
  try {
    connection = await oracledb.getConnection(DB_CONFIG);
    const result = await connection.execute(
      `SELECT COUNT(*) FROM NOMINA WHERE DNI_NOM = :nif`,
      [nif]
    );
    return result.rows[0][0];
  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { DB_CONFIG, getNominaCount };
