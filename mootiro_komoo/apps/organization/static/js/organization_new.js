var change_msg = function(msg){
    if($('#org-div-progress .alert').is(':hidden')){
        $('#org-div-progress .alert').slideDown();
    }
    var $msg = $('#org-div-progress .alert .msg');
    $msg.fadeOut('100', function(){
        $msg.html(msg);
        $msg.fadeIn('100');
    })
};

var change_percent = function(percent){
    $('#org-div-progress .percent').html(
        percent + '% ' + gettext('complete'));
};

var change_step = function(step){
    var percent, msg;

    for (var i = 1; i < 5 ; i++) {
        $('.step_' + i).hide();
    }
    $('.step_' + step).show();
    percent = Math.round(step * 33.33 - 33.33);
    $('.progress .bar').css('width', '' + percent + '%');

    if (step === 1){
        $('.step_1_row_1').show();
        $('.step_1_row_2').hide();
        $('.step_1_row_3').hide();
    } else if (step === 4) {
        // change_msg('Parabéns você concluiu o processo de adição de uma organização/filial');
        change_msg(gettext('Congratulations, you have concluded the organization/branch addition process'));
    }
    change_percent(percent);
    window.scrollTo(0, 0);
};

$(function(){
    change_step(1);
    // change_msg('Forneça o nome da organização para verificarmos se ela ainda não foi cadastrada no sistema.');
    change_msg(gettext("Provide the organization name so we can verify if it's already registered on our system"));
    $('a.close').click(function(){
        $(this).parent().slideUp();
    });

    $('#name_verify').click(function(){
        $.post(
            '/organization/verify_name/',
            {'org_name': $('#id_org_name_autocomplete').val()},
            function(data){
                var msg, step;
                if (data.exists){
                    // change_msg('Esta organização já existe. Deseja adicionar uma filial?');
                    change_msg(gettext('This organization already exists. Do you want to add a branch?'));
                    $('.step_1_row_1').hide();
                    $('.step_1_row_2').show();
                    $('#form_branch #id_branch_organization').val(data.id);
                    $('#btn_concluir').attr('slug', data.slug);
                } else {
                    // change_msg('Esta organização ainda não foi cadastrada. Deseja adicionar esta organização?');
                    change_msg(gettext("This organization is not registered yet. Do you want to add this organization?"));
                    $('.step_1_row_1').hide();
                    $('.step_1_row_3').show();
                }

            },
            'json');
    });

    $('#btn_add_filial').click(function(){
        change_step(3);
        // change_msg('Entre com os dados da filial que você marcou no mapa');
        change_msg(gettext('Enter with the data from the branch you have marked on map'));
        var name = $('#id_org_name_autocomplete').val();
        $('#id_filial_org_name').val(name);
    });

    $('#btn_add_org').click(function(){
        change_step(2);
        // change_msg('Entre com os dados da Organização que detém a unidade que você marcou no mapa.')
        change_msg(gettext('Enter with the data from the Organization which owns the branch you have marked on map.'));
        var name = $('#id_org_name_autocomplete').val();
        console.log('name: ' + name)
        $('#form_organization #id_name').val(name);
        $('#id_filial_org_name').val(name);
    });

    $('.step_1_cancel').click(function(){
        change_step(1);
        // change_msg('Forneça o nome da organização para verificarmos se ela ainda não foi cadastrada no sistema.');
        change_msg(gettext("Provide the organization name so we can verify if it's already registered on our system"));

    });

    $('#btn_concluir').click(function(){
        var slug = $(this).attr('slug');
        window.location.pathname = dutils.urls.resolve('view_organization', {'organization_slug': slug, 'community_slug': ''}).slice(1);
    });

    $('#form_organization').ajaxform({
        onSuccess: function(data){
            change_step(3);
            // change_msg('Parabéns, sua organização foi salva corretamente. Por favor, agora preencha os dados para a filial que você marcou no mapa');
            change_msg(gettext('Congratulations, your organization was successfully saved. Please, now add the data from the branch you have marked on the map'));
            $('#form_branch #id_branch_organization').val(data.obj.id);
            $('#id_filial_org_name').val(data.obj.name);
            $('#btn_concluir').attr('slug', data.obj.slug);
        }
    });
    $('#form_branch').ajaxform({
        onSuccess: function(data){
            change_step(4);
        }
    });
})