
--https://www.apexofficeprint.com/docs/getting-started/plugin-install/

--Quick Install Guide - APEX Office Print (AOP)


--configurar ACL

BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => 'api.apexofficeprint.com',
    ace => xs$ace_type(
      privilege_list => xs$name_list('connect'),
      principal_name => 'APEX_240200', --permiso a APEX
      principal_type => xs_acl.ptype_db
    )
  );
END;
/

BEGIN
  DBMS_NETWORK_ACL_ADMIN.APPEND_HOST_ACE(
    host => 'api.apexofficeprint.com',
    ace => xs$ace_type(
      privilege_list => xs$name_list('connect'),
      principal_name => 'TFGUBU', -- permiso al esquema
      principal_type => xs_acl.ptype_db
    )
  );
END;
/
